+++
title = "Python Workers for AI Workflows"
date = 2026-03-01
description = "Kruxia Flow now supports external Python workers, bringing pandas, scikit-learn, and the full data science ecosystem into durable workflow execution."

[taxonomies]
tags = ["python", "ai", "workflows", "workers", "opensource"]

[extra]
author = "Sean Harrison"
canonical_url = "https://kruxiaflow.com/blog/posts/python-workers-for-ai-workflows/"
+++

When I first built Kruxia Flow, the built-in worker handled everything. It ships inside the single Rust binary and executes standard activities — HTTP requests, database queries, LLM prompts, email — all with sub-millisecond dispatch overhead. For many workflows, that's all you need.

But many of the teams I work with live in Python. Their data pipelines use pandas or polars. Their ML models use scikit-learn and transformers. Their analysis notebooks use DuckDB. Asking them to rewrite all of that in Rust to fit inside a workflow engine would be absurd. So I built a way to bring Python into Kruxia Flow without compromising the architecture: using external workers.

## How External Workers Work

Kruxia Flow's worker architecture has a deliberate design choice: the built-in Rust worker communicates with the engine over the same HTTP API that external workers use. It doesn't get special database access or internal shortcuts. This means any language that can make HTTP calls and handle JSON can host a Kruxia Flow worker.

The pattern is straightforward. In any runtime:

1. **Poll** for pending activities: `POST /api/v1/workers/poll` specifying the name of your worker
2. **Execute** the activities that your worker supports
3. **Report** the results: `POST /api/v1/activities/{id}/complete`

Authentication uses OAuth client credentials, and the activity queue uses PostgreSQL's `FOR UPDATE SKIP LOCKED` for safe concurrent claiming across multiple workers. No messages are lost, no double executions occur.

This is exactly the pattern that the built-in Rust `std` worker and the Python `py-std` worker use.

## The Python SDK and py-std Worker

The [Python SDK](https://github.com/kruxia/kruxiaflow-python) (`kruxiaflow-python`) provides a worker framework that handles polling, authentication, token refresh, and result reporting. You write activity functions and initialize the worker with those activities; the SDK handles the plumbing.

The `py-std` worker is a pre-built standard worker that ships with the Python SDK. It is designed to run any Python code that can run using the included libraries. Install it with pip or uv:

```bash
# uv is also supported
pip install "kruxiaflow-python[std]"
```

That `[std]` extra pulls in the data science ecosystem: pandas, DuckDB, scikit-learn, and more. Your workflow activities can use any of these libraries directly.

To use a Python worker in a workflow definition, you specify `worker: py-std` on the activities. The py-std worker exposes a single activity type, `script`, which runs arbitrary Python. In this example, input data arrives via the `INPUT` dict, and results go into `OUTPUT`:

```yaml
activities:
  - key: transform
    worker: py-std
    activity_name: script
    parameters:
      script: |
        import pandas as pd
        df = pd.DataFrame(INPUT["data"])
        OUTPUT = {"result": df.describe().to_dict()}
    depends_on: [fetch-data]
```

The orchestrator schedules activities to the correct worker pool based on the `worker` field. Activities with `worker: std` go to the built-in Rust worker. Activities with `worker: py-std` go to the Python worker pool. A single workflow can use any or all of the available workers.

## Architecture: Separate Server, Separate Worker

In production, the py-std setup uses a dedicated Kruxia Flow server running with `--no-worker` (API + orchestrator only) alongside one or more Python worker containers:

```
                        +----------------------+
    Client ------------>| Kruxia Flow          |
                        | (API + Orchestrator) |
                        | --no-worker          |
                        +--------+-------------+
                                 |
                    +------------+------------+
                    |                         |
            +-------+-------+     +-----------+---------+
            | py-std Worker |     | py-std Worker       |
            | (Python)      |     | (Python)            |
            +---------------+     +---------------------+
```

This separation lets you scale Python workers independently — add more containers when activity volume spikes, without duplicating the orchestrator.

## Benchmark Results

We added py-std to the benchmark suite alongside the built-in Rust worker, Temporal, and Airflow, running identical echo workflows. Results from March 1, 2026:

| Platform              | Sequential-5 | Parallel-10 | High-Concurrency-3 |
|-----------------------|--------------|-------------|---------------------|
| Kruxia Flow           | 15.0 wf/s    | 17.5 wf/s   | 74.0 wf/s           |
| Kruxia Flow (py-std)  | 15.2 wf/s    | 17.1 wf/s   | 103.4 wf/s          |
| Temporal              | 13.1 wf/s    | 26.1 wf/s   | 47.7 wf/s           |
| Airflow               | 2.5 wf/s     | 2.1 wf/s    | 7.1 wf/s            |

Throughput in workflows per second (higher is better). All platforms at 100% success rate.

The py-std worker holds its own. Sequential and parallel throughput is within 3% of the built-in Rust worker — the bottleneck in those scenarios is orchestration, not activity execution. In the high-concurrency scenario (300 workflows, 100 concurrent), py-std actually outperforms the built-in worker at 103 wf/s vs 74 wf/s, likely due to the separated server architecture reducing resource contention on the orchestrator.

Both Kruxia Flow configurations significantly outperform Airflow (10-35x faster) and are competitive with Temporal across scenarios.

## What This Means

If you're building AI workflows that need Python — and most AI workflows do — you no longer have to choose between a fast workflow engine and your existing Python code. Write your data transformations in pandas, your ML inference in scikit-learn, your NLP processing in spaCy, and let Kruxia Flow handle the orchestration, durability, and cost tracking.

The Python SDK is MIT-licensed and lives at [github.com/kruxia/kruxiaflow-python](https://github.com/kruxia/kruxiaflow-python). The core engine is AGPL-3.0 at [github.com/kruxia/kruxiaflow](https://github.com/kruxia/kruxiaflow).
