+++
title = "Put a spending limit on your agents"
date = 2026-08-17
description = "Gateways cap API keys; workflow engines should cap workflows. The case for LLM budgets enforced in the workflow engine — with real production numbers."
published = true

[taxonomies]
tags = [ "ai", "llm", "budgets", "workflows", "opensource",]

[extra]
author = "Sean Harrison"
canonical_url = "https://kruxiaflow.com/blog/posts/put-a-spending-limit-on-your-agents/"
+++

*Hard budgets for your agents, enforced in the workflow engine.*

An agent that can call an LLM can spend money. Follow that one step further: an agent with a bug can spend money in a loop, and in most stacks there is nothing standing between that loop and the invoice. Cost blowups are one of the most common complaints from teams running agents in production, and the usual remedies are a dashboard you check afterward and a provider limit you find out about when everything stops working at once.

The more serious answer today is a gateway. Portkey, Helicone, and Bifrost will all put a spending cap on an API key, and if you run agents in production you should probably have one. But a key cap is the wrong blast radius. A key doesn't know which workflow is spending through it, so it can't tell the runaway from the two hundred well-behaved jobs sharing the key — when the cap trips, it takes them all down together. And because the gateway sits outside your orchestration, it can't do anything *inside* a workflow: it can't swap in a cheaper model mid-run, it can't fail one workflow cleanly while its siblings proceed, and it can't leave a record of which step was skipped and why.

Gateways cap API keys. Workflow engines should cap workflows.

That's the idea Kruxia Flow is built around. It's a cost-governed orchestration engine: durable workflow execution — retries, dependencies, human approval gates, event sourcing — where every token is priced as it's spent and the budget is a first-class part of the workflow definition, enforced by Kruxia Flow before the money leaves the building. As far as I can tell, no durable-execution engine — not Temporal, Inngest, DBOS, or Hatchet — offers per-workflow token budgets, budget-aware model fallback, or budget enforcement as native primitives.

Here's what a budgeted workflow looks like:

```yaml
activities:
  - key: research
    activity_name: llm_prompt
    parameters:
      model:
        - anthropic/claude-sonnet-5      # preferred
        - google/gemini-3.6-flash        # cheaper
        - google/gemini-3.5-flash-lite   # if budget is tight
      prompt: "Research and summarize: {{INPUT.topic}}"
      max_tokens: 1000
    settings:
      budget:
        limit: 0.25   # hard ceiling, enforced before the call
        action: abort
```

Budgets exist at two levels — per activity and per workflow — and when the money runs out, three responses are on the table. The first two are budget actions the Kruxia Flow engine takes by itself; the third is a workflow capability you compose with them:

**Stop.** The check runs *before* execution, not after. Before an LLM activity is scheduled, the workflow engine estimates the cost of the cheapest model in its fallback chain and tests the cumulative activity and workflow spend against their limits. If the estimate doesn't fit, the activity is never queued and no API call is made — the workflow fails with "Budget exceeded before execution," and the Kruxia Flow engine writes a zero-cost audit row recording the abort and the estimate that tripped it. There's nothing to refund because nothing was spent.

**Downgrade.** When an activity lists a fallback chain, the worker estimates each model against the remaining budget and skips the ones that don't fit, in order, until it reaches one that does. If your preferred model would blow the budget but a cheaper one fits, the work still gets done — and the completed cost row is marked as a downgrade, so you can see exactly where quality was traded for spend.

**Ask a human.** This one is not a budget action — the budget actions are exactly `abort` and `continue`. Human approval is its own workflow primitive, independent of money: Any step in any workflow can suspend on a `wait_for_signal` gate and hold durably — through restarts, indefinitely if needed — until someone approves or rejects over the API. You'd use it in front of a deploy, a publish, or a destructive migration whether or not a budget is anywhere in sight. What makes it belong in this list is composition: Budget state is queryable mid-workflow, so you can place an approval gate exactly where spend crosses a threshold — the budget supplies the signal, the gate supplies the judgment. That's a line of YAML, not custom infrastructure.

And the gate is a dial, not a confession. In our own production app, the most consequential step originally ran behind a human approval gate; once the automated decision had proven itself, we retired the gate and let it auto-apply — with the budget still holding as the hard floor underneath. That's what agent autonomy looks like in practice: Humans approve until the evidence says they don't need to, you re-gate anything whose stakes change, and the spending limit is the guarantee that never comes off.

Everything lands in your own PostgreSQL: per-call token counts priced from a catalog covering Anthropic, OpenAI, Google, and self-hosted Ollama models (which price at zero), queryable per activity, per workflow, per model, per provider — through an API, a CLI, and a built-in dashboard.

<!-- SCREENSHOT drop-in: save the capture as dashboard-cost-analytics.png in this
     post's directory, then replace this whole comment with the following line:

NOTE: Replace with more up-to-date production dashboard. 
-->

![Kruxia Flow cost analytics dashboard — spend over time, by provider and model, and budget events](https://kruxiaflow.com/blog/posts/put-a-spending-limit-on-your-agents/dashboard-cost-analytics.png)

## This runs in production, not in a demo

I don't want to sell this on hypotheticals, so here are the numbers I actually have.

Nukumori, a conversational AI app I run in production, executes its background jobs on Kruxia Flow — including a multi-pass LLM reflection job that runs after each conversation. When a real conversation ends in production, the reflection runs through the Kruxia Flow engine on live models. On one recent conversation, the workflow engine's cost total came out to $0.1069. The app also settles Gemini context-cache storage (billed per token-hour) through a Kruxia-Flow-scheduled sweep; that session booked $0.0072 of storage cost. Per-job spend now comes from the Kruxia Flow engine's cost API instead of hand-rolled accounting. (How the app got there is its own story — the next post.)

Agents can author budgeted workflows themselves. In a live Claude Code session against Kruxia Flow's MCP server, the agent searched the model catalog, wrote and validated a workflow definition, deployed it, estimated the cost at $0.001881, submitted it with a five-cent hard cap, and completed the run at an actual cost of $0.001472 — 2.9% of its budget. The agent wrote its own spending limit, and the Kruxia Flow engine held it to it.

So what would a runaway cost? Illustrative arithmetic, not an incident report: our reflection job costs about eleven cents. A stuck retry loop re-running it every two minutes overnight is roughly $26 by morning — annoying at these prices, ruinous at 100× the volume or with a heavier prompt. The same bug inside a workflow budgeted at $0.25 costs $0.25, because the Kruxia Flow engine refuses to schedule the call that would exceed it. That's the entire pitch: the worst case becomes the number you wrote down.

## The embarrassing part

If you claim "enforced in the workflow engine," you'd better check. Before launch, we audited our own enforcement path and found two holes. Costs reported by external (bring-your-own-code) activities were display-only — they never reached the cost tables, which meant external activities were invisible to budget enforcement: a budget bypass in a budget product. And workflow-level budgets parsed cleanly from YAML but were never persisted, so workflow-level enforcement was silently comparing against nothing. Both were fixed and end-to-end tested — live aborts, live downgrades, external usage priced and counted against budgets — before launch, because for this product an unenforced limit isn't a fidelity gap, it's the worst class of bug we can ship. We treat any recurrence as release-blocking.

## Try it

Kruxia Flow is open source under Apache-2.0. It runs budgeted workflows as a single 13 MB Rust binary against a PostgreSQL database — no Kafka, no Cassandra, no sidecar fleet. If your agents spend money, put a limit on them:

```bash
curl -fsSL https://raw.githubusercontent.com/kruxia/kruxiaflow/main/docker-compose.yml -o docker-compose.yml
KRUXIAFLOW_INSECURE_DEV=true ANTHROPIC_API_KEY=your-key-here docker compose up -d
```

That's the whole setup — a few minutes to a running Kruxia Flow, a dashboard at `/dashboard`, and your first budgeted workflow. The code, the docs, and the examples are at [github.com/kruxia/kruxiaflow](https://github.com/kruxia/kruxiaflow). I'd be glad to hear what you think — GitHub Discussions is the front door.

–Sean
