+++
title = "Benchmarking Workflow Engines: What the Numbers Tell Us"
date = 2026-03-01
description = "Comparing Kruxia Flow, Temporal, and Airflow 3 across sequential, parallel, and high-concurrency workflow scenarios."

[taxonomies]
tags = ["benchmarks", "performance", "temporal", "airflow", "opensource"]

[extra]
author = "Sean Harrison"
canonical_url = "https://kruxiaflow.com/blog/posts/benchmark-update-march-2026/"
+++

I've been running benchmarks against other workflow engines since Kruxia Flow's first release. Not to declare a winner — these are fundamentally different tools built for different problems — but because the numbers reveal something about each engine's architecture and where it shines.

This round compares four configurations: Kruxia Flow with the built-in Rust worker, Kruxia Flow with the external Python worker (py-std), Temporal, and Airflow 3.

## What We Measure

All platforms run in Docker Compose on the same machine, tested one at a time. The workloads are simple echo activities — no real computation, no LLM calls, no I/O. This is intentional: we're measuring the engine's overhead, not the work it's orchestrating. Three scenarios:

- **Sequential-5**: 5 activities in series, 100 workflows, 10 concurrent. Tests basic orchestration latency — how fast can the engine schedule one activity after another?
- **Parallel-10**: 10 activities in parallel with fan-out/fan-in, 50 workflows, 10 concurrent. Tests the engine's ability to dispatch and collect parallel work.
- **High-Concurrency-3**: 3 activities per workflow, 300 workflows, 100 concurrent. Tests how the engine behaves under load — queue contention, connection pressure, scheduling fairness.

Benchmark code and raw results are in the [benchmarks directory](https://github.com/kruxia/kruxiaflow/tree/develop/benchmarks).

## The Numbers

### Throughput

| Platform              | Sequential-5 | Parallel-10 | High-Concurrency-3  |
|-----------------------|--------------|-------------|---------------------|
| Kruxia Flow           | 15.0 wf/s    | 17.5 wf/s   | 74.0 wf/s           |
| Kruxia Flow (py-std)  | 15.2 wf/s    | 17.1 wf/s   | 103.4 wf/s          |
| Temporal              | 13.1 wf/s    | 26.1 wf/s   | 47.7 wf/s           |
| Airflow 3             | 2.5 wf/s     | 2.1 wf/s    | 7.1 wf/s            |

Workflows per second (higher is better). All platforms at 100% success rate.

### Latency (P95)

| Platform              | Sequential-5 | Parallel-10 | High-Concurrency-3  |
|-----------------------|--------------|-------------|---------------------|
| Kruxia Flow           | 861 ms       | 687 ms      | 1,503 ms            |
| Kruxia Flow (py-std)  | 1,081 ms     | 707 ms      | 1,133 ms            |
| Temporal              | 703 ms       | 447 ms      | 2,695 ms            |
| Airflow 3             | 6,797 ms     | 6,774 ms    | 19,022 ms           |

Milliseconds per workflow at the 95th percentile (lower is better).

### Resource Usage

| Platform              | Peak Memory | Containers |
|-----------------------|-------------|------------|
| Kruxia Flow           | 343 MB      | 2          |
| Kruxia Flow (py-std)  | 337 MB      | 3          |
| Temporal              | 425 MB      | 2          |
| Airflow 3             | 7,308 MB    | 7          |

## What the Numbers Tell Us

### Airflow Is a Batch Scheduler

Airflow 3 is the slowest across every scenario, and that's fine — it's not trying to be fast at this. Airflow is built for scheduled batch processing: cron-triggered DAGs that run ETL jobs, generate reports, and retrain models on a cadence. Its architecture reflects that: a scheduler, a DAG processor, a Celery executor with Redis as a broker, and a web server. Seven containers, 7 GB of RAM, and 2-7 workflows per second.

For its intended use case — "run this pipeline every night at 2 AM" — none of that matters. Startup latency and per-workflow overhead are irrelevant when your DAG runs once a day. But for event-driven, interactive workflows where a user or an AI agent is waiting for a result, the 4-11 second median latency is a problem. Airflow 3 is a significant step forward from v2, but it's still a batch tool at heart.

### Temporal Is Built for Parallel Dispatch

Temporal wins the Parallel-10 scenario convincingly: 26.1 wf/s vs Kruxia Flow's 17.5, with the best P95 latency of the group at 447 ms. Its gRPC-based architecture and matching/dispatch system are purpose-built for fanning out work to worker pools. If your workload is heavily parallel — lots of activities dispatched simultaneously and collected — Temporal handles that pattern very well.

Under high concurrency, though, the picture shifts. At 300 concurrent workflows, Kruxia Flow's throughput (74 wf/s) is 55% higher than Temporal's (47.7 wf/s), and P95 latency is nearly half (1,503 ms vs 2,695 ms). Temporal's P99 latency spikes to 4,392 ms — suggesting its dispatch system encounters contention under heavy concurrent load.

Sequential workflows are close: Kruxia Flow at 15.0 wf/s, Temporal at 13.1. Both are spending most of their time in the orchestration loop — schedule an activity, wait for completion, schedule the next. The difference is modest and within the range where benchmark environment matters.

### The py-std Surprise

The most interesting result is the Python worker variant. In the high-concurrency scenario, Kruxia Flow with py-std hits 103.4 wf/s — the highest throughput of any configuration, 40% faster than the built-in Rust worker.

This seems counterintuitive — a Python worker outperforming a Rust worker? — but it makes sense architecturally. The py-std configuration runs the API server and orchestrator in one container (`--no-worker`) with the Python worker in a separate container. The built-in configuration runs everything in a single process. Under high concurrency, the separated architecture gives the orchestrator dedicated resources. It's not that Python is faster; it's that separation of concerns helps when 300 workflows are competing for CPU time.

For sequential and parallel scenarios where concurrency is lower (10 concurrent), both configurations perform within 3% of each other. The orchestration loop is the bottleneck, not the worker.

## Caveats

These are Docker benchmarks with echo activities. They measure engine overhead, not real-world performance. Some things they don't capture:

- **Network latency**: Everything runs on localhost. Real deployments add network hops.
- **Activity duration**: Real activities take milliseconds to minutes. The ratio of engine overhead to useful work shifts dramatically.
- **Persistence costs**: Echo activities don't store meaningful state. Workflows with large payloads or many events will stress storage differently.
- **Operational complexity**: These numbers don't reflect what it takes to run each platform in production. Temporal requires more operational investment; Airflow has a steeper configuration surface.

Run-to-run variance in Docker benchmarks is real. We've seen 5-20% swings between runs with identical code, depending on what else the machine is doing. Take the absolute numbers as approximate and focus on the relative differences.

## Reproduce It

All benchmark code, Docker configurations, and raw results are open source:

```bash
# From the kruxiaflow repo root
./scripts/init.sh
cd benchmarks
docker-compose up --build
```

Results land in `benchmarks/results/`. If your numbers look different from ours, that's expected — hardware, Docker runtime, and OS all matter. The relative comparisons should hold.

Code: [github.com/kruxia/kruxiaflow](https://github.com/kruxia/kruxiaflow) (AGPL-3.0)
