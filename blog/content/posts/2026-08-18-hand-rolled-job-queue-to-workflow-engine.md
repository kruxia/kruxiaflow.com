+++
title = "I replaced my hand-rolled Postgres job queue with my own workflow engine"
date = 2026-08-18
description = "What a 1,400-line hand-rolled Postgres job queue did, what broke when we moved its jobs onto Kruxia Flow, and the honest tradeoffs of dogfooding your own workflow engine."
published = true

[taxonomies]
tags = [ "rust", "postgres", "workflows", "dogfooding", "opensource",]

[extra]
author = "Sean Harrison"
canonical_url = "https://kruxiaflow.com/blog/posts/hand-rolled-job-queue-to-workflow-engine/"
+++

I maintain two codebases that were quietly implementing the same thing. One is Kruxia Flow, a durable workflow engine I've been building in Rust. The other is Nukumori, a conversational AI app with a small private beta, which ran its background jobs on a hand-rolled durable job queue: about 1,400 lines of Postgres-backed infrastructure I had written, tested, and was maintaining alone.

In July I moved Nukumori's jobs onto the engine. This is the story of what the queue did, what the port broke — mostly in the engine — what the engine had to grow to earn the job, and what I've actually deleted so far (less than you'd think).

## The queue I wrote instead of using a workflow engine

The bespoke queue was genuinely decent. An event-sourced core — a `job_events` log with a `job_queue` projection — leasing work via `FOR UPDATE SKIP LOCKED` with a TTL-based reclaim for dead workers, exponential retry backoff (base 60 seconds, doubling, capped at 30 minutes), dead-lettering after max attempts, once-per-conversation dedup through a partial unique index, and a recurring singleton job re-seeded at boot for periodic work. Multi-replica safe. No embarrassing TODOs.

It ran three jobs: a multi-pass LLM reflection after each conversation, an occasional larger consolidation (originally behind a human review gate — we retired the gate once the automated decision had proven reliable, which is its own small lesson: human-in-the-loop was a setting we relaxed on evidence, not a limitation we worked around), and a cache-flush sweep every couple of minutes that settles Gemini context-cache storage costs (Gemini bills cached context by the token-hour, so somebody has to flush and book it).

The assessment I wrote before the port said it plainly: it is not broken, it is undifferentiated. Read that feature list again — retries with backoff, leases, dead letters, event sourcing, a scheduler. That's a workflow engine. I was maintaining a small one inside my app while also building a real one next door, and the app one made me better at nothing.

## Port rules

I didn't do a big-bang cutover. Every job kind got an env flag — `bespoke` or `kruxiaflow` — with the bespoke path kept intact for rollback, and one worker binary running both faces: the old poll loop and the new engine SDK, side by side. Cutting over (or back) is an API config flip with no worker deploy.

Two design points mattered more than I expected. First, privacy: the engine never sees conversation content. Workflow inputs are references; the worker fetches the actual transcripts from the app by ID. Second, atomicity: with the bespoke queue, "do the work" and "mark it done" could commit in one database transaction. With an external engine that's gone, so the worker persists results first and completes second, with idempotency keyed on the conversation — a replayed completion becomes a no-op. You don't get to skip this thinking just because the engine is durable.

## What broke (mostly: my engine)

Dogfooding is supposed to hurt, and it did. The port put a paying-quality consumer — my own money — on the engine, and it found real bugs. The uncomfortable theme: **my hand-rolled queue was better than my engine at several things the engine claimed to do.**

**Retry backoff didn't actually exist.** The engine parsed and stored retry settings, and then requeued failures immediately. I watched three retries burn in about 350 milliseconds — so a transient provider blip got no recovery window at all and went straight to dead-letter, where my bespoke queue would have ridden it out with minutes of backoff. The root cause was better than a missing feature: there were *two* independent retry deciders. The queue requeued immediately; the orchestrator computed a correct backoff and then re-scheduled through an `ON CONFLICT DO NOTHING` insert, so its backoff silently never took effect. The fix made the queue the single retry authority — one decider, one counter, real backoff — and fixed an off-by-one where "3 attempts" quietly meant 4.

**The stuck-`running` mystery.** On an earlier engine version, a job that terminally failed would leave its workflow stuck `running` forever — the failure never reached the workflow's state until an orchestrator restart happened to reconcile it. Dead letters were invisible in the status API. When I finally root-caused it during the port, it was a beautiful bug: the event store's idempotency dedup allowed exactly one `ActivityFailed` event per activity *ever*. The first retryable failure occupied the slot; when the terminal failure arrived later, `ON CONFLICT DO NOTHING` swallowed it. The workflow could never learn its activity had died. The fix makes dedup attempt-aware; terminal failures now propagate in about two seconds, no restart.

**Failed workflows squatted on their dedup keys.** Nukumori's dedup key is `post_conversation:<conversation_id>` — one reflection per conversation, ever. Except a dead-lettered workflow held its key forever, so a permanently failed reflection could never be resubmitted. (On the bespoke queue, ops-me could requeue with SQL.) The fix scopes the unique index to non-failed workflows: duplicates while active still get a clean 409, resubmission after terminal failure gets a 201.

**There were no recurring schedules.** The engine's answer to "run this every two minutes" was workflow chaining, which turns out to be unusable for authenticated recurrence — tokens go stale mid-chain, and a chain that dies takes the schedule silently with it. I shipped the workaround (an app-side ensure-loop submitting time-bucketed dedup keys) and then replaced it when the engine grew first-class schedules: cron or interval, overlap policies, and a misfire rule that collapses downtime backlog into at most one catch-up run. Deleting the ensure-loop was the port's first real code deletion — all of 48 lines, but the right 48.

**Time-based costs didn't fit the cost model.** Gemini bills cache storage per token-hour — a cost dimension that per-call usage entries structurally cannot express. The sweep books the swept storage as a lump activity cost, and the engine's pricing catalog grew a storage dimension ($1.00 per million token-hours on Flash tiers, $4.50 on Pro) so the model exists engine-side too.

**And the ops paper cuts.** The Docker `latest` tag pointed at a version that predated external cost reporting — running it silently dropped external activities' costs, so we adopted hard version pins and CI now moves `latest` only on releases. The CLI health check reported DEGRADED against every healthy server ever released, because the CLI parsed a readiness shape the server had never once produced — its mock-based tests verified the client against my assumptions, not against the server. And dead-lettered workflows carried no failure reason over the API; now they do, including my favorite error message in the codebase, for the case where work sat unclaimed until timeout: "is a worker for this queue running?"

Every one of those fixes shipped within days, because they weren't roadmap items — they were a real consumer refusing to cut over without them.

## The benchmark that turned out to be a durability test

One more find, from an unexpected direction. Our launch rule is that published benchmark numbers must be reproducible from a clean checkout, so I re-ran the whole suite on the new release — and 2 of 900 workflows hung. Their activities had completed; the completion events just committed a few milliseconds after the consumer's cursor had already read past their UUIDv7 ids. Id order is not commit order. An event can exist, be durable, be correct — and never be seen.

Same disease as the stuck-`running` bug: an event that exists but is never delivered. The fix: the durable cursor now trails a 500 ms visibility grace window and only advances through the contiguous prefix of processed events, and every event handler became fully replay-idempotent — which flushed out a latent horror where a replayed `WorkflowCreated` could wipe a workflow's activity progress back to unscheduled. The benchmark suite's 100%-success criterion now guards all of it on every run. I went in expecting a throughput number and came out with a durability fix; that re-run earned its place in CI forever.

## Cutover

Production cut over in stages — the sweep and the reflection on July 21, the consolidation the following week — and all three job kinds now run on the engine. The sweep fires on an engine-side schedule (verified surviving a deploy roll mid-window — the misfire policy collapsed the gap into one catch-up run), and when a real conversation ended on cutover evening, the reflection ran through the engine on live models. The engine's cost total: $0.1069275 — matching the app's own independent audit exactly, to the seventh decimal. The sweep booked $0.0072 of cache storage the same way. Per-job costs now come from the engine's cost API instead of a bespoke costs table.

## Honest tradeoffs

**I haven't deleted the queue yet.** The 1,400 lines are still there, running beside the engine path, because the rollback flag stays until the port has soaked — a few hundred jobs per kind. The deletion is scheduled, not done, and I'd rather tell you that than pretend.

**The port is net-positive in lines of code — and LOC turns out to be the wrong metric.** Porting the three jobs cost about 3,000 lines on the app side: workflow definitions, the worker's second face, deploy config, ops tooling, tests. Even after the bespoke queue is deleted, the app comes out more than a thousand lines *larger*. If line count were the point, the port failed. But the queue's cost was never its size — it was that I was the sole maintainer of subtle concurrency infrastructure: lease reclamation, backoff math, event dedup, the kind of code whose bugs are rare, silent, and expensive. What replaced it is a different kind of code — declarative definitions and a thin seam that state *what* runs, while the engine owns *how*, backed by a test suite and a durability harness no solo app queue could justify. When that harness caught the event-stranding bug, this app got the fix by bumping a version pin. And the engine brought capabilities the queue was never going to grow: budgets enforced before the money is spent, cost accounting that reconciles to the cent, first-class schedules, dead-letter observability, and a durable approval gate for whatever needs a human next. I traded code I had to be smart about for code I only have to be clear about, and the app got a cost-governance layer in the bargain.

**A workflow engine is a bigger dependency than a jobs table.** If a plain jobs table is enough for your app, keep it. Mine had stopped being plain — it had grown backoff, dead-letters, a lease reclaimer, and a scheduler, and at that point I was maintaining a workflow engine with none of the benefits of one.

**You keep the hard thinking.** Durable execution didn't absolve me of idempotency or exactly-once semantics across stores; it just moved where I had to be careful.

**This is a correctness story, not a scale story.** Nukumori is a solo-operated beta with real outside usage — hundreds of jobs, not millions. What the port proved is that the engine survives contact with a production consumer that checks the bill: every dollar the engine reported matched an independent audit, and every bug it had in this path got found by someone who couldn't shrug it off.

If you have a jobs table that's growing retries, backoff, dead letters, and a scheduler — you're writing a workflow engine. I wrote one on purpose instead: Kruxia Flow runs budgeted workflows — durable execution with hard cost limits enforced in the engine — as a single Rust binary against Postgres, Apache-2.0. The code is at [github.com/kruxia/kruxiaflow](https://github.com/kruxia/kruxiaflow), and the whole cost-governance argument is in the previous post, [Put a spending limit on your agents](https://kruxiaflow.com/blog/posts/put-a-spending-limit-on-your-agents/).

–Sean
