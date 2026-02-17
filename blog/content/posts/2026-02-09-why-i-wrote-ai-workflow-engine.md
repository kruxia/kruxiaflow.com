+++
title = "Why I Wrote an AI Workflow Engine"
date = 2026-02-09
description = "In AI applications, LLM cost is an infrastructure concern."

[taxonomies]
tags = [ "ai", "rust", "workflows", "opensource",]

[extra]
author = "Sean Harrison"
canonical_url = "https://kruxiaflow.com/blog/posts/why-i-wrote-ai-workflow-engine/"
devto_article_id = 3261120
+++

I kept building the same things over and over.

Over the past couple of years, I've been working on a handful of applications that all share a common thread: they need AI, they need durability, and they need to not bankrupt my clients.

- A **memoir writing assistant** helps people write their life stories and memoirs with AI assistance — long-running, conversational workflows that guide someone through the deeply personal work of capturing their history.
- A **small-business finance application** manages personal and small-business finances, which means business process workflows — approvals, reconciliations, recurring tasks — layered with AI for categorization and insights.
- A **customer chatbot** for a current client navigates an extensive knowledge base via RAG, handle support concerns, and assist with parts selection and ordering.
- An **academic research assistant** manages research projects with LLM-powered analysis and synthesis.

These projects need three things that I kept having to build from scratch: durable workflow orchestration, integration with AI agents, and some kind of control over AI costs. Each time I would start a new project, I'd see the same patterns: Queue the work, call the AI engine, track the progress, handle retries, persist progress, and notify the user. I knew there had to be a better way, so I went looking.

## What I Found (and Why It Wasn't Enough)

The workflow orchestration space isn't empty. There are serious, battle-tested tools out there. But none of them fit what I actually needed.

**Temporal** is the gold standard for durable execution. But teams report spending months per year just on maintenance. And Temporal has zero awareness of AI workloads. It doesn't know what a token is, let alone what one costs. For a solo developer or a small team building AI applications, it's a lot of operational overhead for an engine that still can't tell you how much your workflows are spending on LLM calls.

**Airflow** is designed for batch scheduling — DAGs that run on a cron. It's not built for event-driven, durable execution. And it's heavy: a gigabyte-plus Docker image, multiple gigabytes of RAM at runtime. For the kind of interactive, AI-driven workflows I'm building, it is the wrong tool entirely.

**LangChain and LangGraph** are closer to the AI side of the problem, but they're Python-only with no native scheduling or durability. To run them in production, you need LangSmith — a proprietary platform that costs around a thousand dollars per million executions. That's vendor lock-in dressed up as a developer tool, and it's exactly the kind of cost structure that small businesses can't absorb.

In short, existing tools were either powerful but operationally heavy and AI-ignorant, or AI-aware but lacking durability and independence. Nothing combined durable workflow orchestration with native AI cost tracking in a way that was simple enough for a small team to run.

## The Insight That Drove the Design

As I started building, I came to a core realization: **In AI applications, LLM cost is an application infrastructure concern.** When your workflow calls an LLM, the cost of that call should influence what happens next. Can I afford to use Claude Sonnet here, or should I fall back to Haiku? Has this workflow already burned through its budget? Should I use the cached result from a similar query instead of making another API call? These aren't questions you answer just by looking at a dashboard after the fact. They need to be answered *during execution*, by the orchestrator itself. Cost tracking belongs in the engine, not bolted on as an afterthought.

## What I Built

Kruxia Flow is a durable workflow engine, like Temporal, but purpose-built for AI applications. It ships as a single Rust binary, about 7.5 megabytes. You run it with a PostgreSQL database. No Kafka, no Elasticsearch, no Cassandra. One binary, one database.

The AI-native features are built into the core:

**Cost tracking is automatic.** Every LLM call gets its tokens counted and priced in real time, using published pricing tables that cover Anthropic (Claude), OpenAI (GPTs), Google (Gemini), and self-hosted models via Ollama (free!). You can see costs per activity, per workflow, or broken down by model and provider.

**Budget enforcement happens before execution.** You set a budget on a workflow or an individual activity, and the engine checks it *before* making the LLM call. If you're over budget, the workflow can abort or alert — your choice. No more surprise bills.

**Model fallback is cost-aware.** Define a fallback chain from expensive models to cheap ones, and the orchestrator automatically picks the most capable model that fits within your remaining budget.

**Semantic caching reduces redundant calls.** Similar queries can hit a cache instead of the API, cutting costs by 50–80% for common patterns like FAQ handling and RAG queries.

And because it's Rust, it's fast and small. In benchmarks against Temporal and Airflow running identical workflows, Kruxia Flow handles 93 workflows per second (vs. Temporal's 66 and Airflow's 8), uses 328 MB of peak memory (vs. Airflow's 7.2 GB), and fits in a 63 MB Docker image. It even runs on a Raspberry Pi Zero.

There's a Python SDK for defining workflows and writing custom workers, with built-in support for pandas, DuckDB, and scikit-learn — because the data teams I work with live in that ecosystem.

## Who It's For

I built Kruxia Flow for people like me: developers and small teams building AI-powered applications who need production reliability without a dedicated platform team.

It's for you if you're an AI startup shipping agents to production and you need to know what they cost. It's for you if you're a small business that wants workflow automation without a five-figure infrastructure bill. It's for you if you're a data team that wants to combine batch pipelines, ML training, NLP processing, and LLM agents without drowning in operational complexity.

## Where It Stands

Kruxia Flow is open source under AGPL-3.0. The core engine, LLM cost tracking, budget enforcement, multi-provider support, token streaming, and the Python SDK (MIT-licensed) are all shipping. Semantic caching, a web dashboard, and a TypeScript SDK are on the roadmap.

I'm still building, and there's a lot of road ahead. But the foundation is solid, and I'm already using it in my own projects — which, after all, is why I built it in the first place.

If any of this resonates, I'd be glad to have you take a look. The code is on [GitHub](https://github.com/kruxia/kruxiaflow), and there's a [Discord](https://discord.gg/ZJAzygCq) where I'm happy to talk about the design, the roadmap, or working with AI.
