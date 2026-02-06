# Landing Page Content Analysis and Recommendations

**Date**: 2026-02-04 (Updated: 2026-02-05)
**Analyzed**: kruxiaflow.com landing page v2 (current revision)
**Compared with**: Project documentation (README.md, architecture.md, mvp-requirements.md)

---

## Executive Summary

The landing page v2 has strong visual design, core messaging, and now includes comprehensive examples and features. Recent updates have addressed most high-priority content recommendations. The page successfully positions Kruxia Flow as a **durable execution engine** (competing with Temporal/Inngest) with **AI-native differentiators** (cost tracking, budgets, streaming).

**Key Changes Implemented** (as of 2026-02-05):
- ✅ Hero headline: "Durable AI workflows, built-in cost controls"
- ✅ Subtitle emphasizes "the only durable workflow engine built for AI"
- ✅ **4 production-ready example tabs** (Weather Report, Content Moderation, Sales ETL, Churn Prediction)
- ✅ **Get Started section with terminal walkthrough** (now positioned after Solution section)
- ✅ **DX highlights** (Python SDK, 15+ examples, zero complexity)
- ✅ **Features section** with durable execution explanation
- ✅ **Comparison table** (Kruxia vs Temporal vs Airflow vs LangChain)
- ✅ Performance stats (7.5MB, 93/sec, 328MB, 4+ providers) → **replaced with persona cards**
- ✅ **"Built For" persona cards** in hero (AI startups, Small businesses, Data teams)
- ✅ **Comparison table**: MIT license highlighted for Temporal and LangGraph; Inngest SSPL shown as weaker

**Remaining Recommendations**:
1. Add "What is Durable Execution?" explainer callout
2. Strengthen the cost hook with more prominence (see note: $14.40 stat is outdated)
3. Add worker model and SDK explanation
4. Add PM/business stakeholder perspective on costs (dashboards, reports, business outcomes)

---

## Current Landing Page State (2026-02-05)

### Implemented Sections

**1. Hero Section**
- Headline: "Durable AI workflows, built-in cost controls"
- Subtitle: "The only durable workflow engine built for AI" with feature highlights
- Status badge: "OPEN SOURCE · AGPL-3.0"
- "Built For" persona cards: AI startups, Small businesses, Data teams
- CTAs: ./get-started button, Star on GitHub button

**2. Problem Section** ("THE_PROBLEM")
- 3 problem cards:
  - No cost visibility ($)
  - Wrong tool for the job (!)
  - Prototype ≠ Production (×)

**3. Solution/Features Section** ("THE_SOLUTION")
- 5 feature cards with icons and explanations:
  - Durable execution (◉)
  - Built-in cost tracking ($)
  - Budget enforcement (⊘)
  - Automatic model fallback (↻)
  - Deploy anywhere (▶)
- Code example: workflow.yaml showing model fallback and budget settings

**4. Get Started Section** ("GET_STARTED") ← Recently moved to this position
- "Running in 2 minutes" headline
- 4-step walkthrough (Clone → Token → Deploy → Track costs)
- Terminal code block with complete setup commands
- DX highlights: Python SDK, 15+ examples, zero complexity

**5. Examples Section** ("EXAMPLES")
- "Production-ready patterns" headline
- 4 tabbed examples:
  - **Weather Report**: No-code, HTTP + Email, built-in activities
  - **Content Moderation**: No-code, LLM with multi-provider fallback, budget limits
  - **Sales ETL**: Python SDK, DuckDB + pandas/polars, data pipelines
  - **Churn Prediction**: Python SDK, ML training, long-running durable workflows
- Each tab includes persona tags, description, code snippet, GitHub link

**6. Comparison Section** ("COMPARISON")
- Table comparing Kruxia vs Temporal vs Airflow vs LangChain
- Rows: Durable execution, LLM cost tracking, Budget enforcement, Model fallback, Token streaming, Binary size, Peak memory

**7. Community Section** ("COMMUNITY")
- 3 community cards: GitHub, Discord, Bluesky
- "Join the project" with AGPL-3.0 mention

### Section Order (Current)
1. Hero
2. Problem
3. Solution/Features
4. **Get Started** ← positioned here (recently moved from bottom)
5. Examples
6. Comparison
7. Community

This order provides a logical flow: value prop → problem → solution → how to start → concrete examples → competitive context → community.

---

## Detailed Findings

### 1. Positioning Clarity: Durable Execution First, AI-Native Second

**Status**: ✅ **ADDRESSED** (recent updates aligned with this)

**Original Issue**: Earlier versions led with "AI workflows that track every token" which didn't establish the foundational value proposition.

**What the docs say**:
- README: "A durable execution engine: workflows survive crashes, retries are automatic, and state is persistent. This puts us in the same category as Temporal and Inngest, not batch schedulers like Airflow."
- MVP Requirements: "Core Value Proposition: Production-ready AI orchestration with operational simplicity—the only platform combining deterministic workflow execution with non-deterministic AI agents"

**Current state**: The updated headline "Durable AI workflows need built-in cost controls" and subtitle correctly position durable execution as the foundation.

**Additional recommendation**: Consider adding a brief callout box that explains:
```
"What is Durable Execution?"
Workflows survive crashes and restarts.
Activities automatically retry.
State is persisted.

Without it: A server crash mid-workflow = lost progress, manual recovery
With it: Workflow picks up exactly where it left off
```

---

### 2. Missing Concrete Use Cases

**Status**: ✅ **FULLY IMPLEMENTED** (4 tabbed examples with code snippets)

**Priority**: HIGH → COMPLETE

**Original Issue**: The landing page shows a generic YAML example. The project has 10+ production-ready examples that would be much more compelling.

**Implementation**: Added "Production-Ready Examples" section with 4 tabbed workflows demonstrating the two-tier approach:
- **Tier 1 (No Code)**:
  - Weather Report (HTTP + Email) - shows built-in activities, no Python required
  - Content Moderation (LLM with multi-provider fallback) - demonstrates budget limits and retry logic
- **Tier 2 (Python SDK)**:
  - Sales ETL Pipeline (DuckDB + pandas/polars) - data transformation workflows
  - Customer Churn Prediction (ML training) - shows long-running durable ML workflows

Each example includes:
- Use case description with target personas (SMBs, Data Engineers, ML Teams)
- Actual code snippets from the examples directory
- Links to full examples on GitHub
- Key benefits highlighted with checkmarks

**Available examples** (from codebase):
1. **Weather Report Pipeline** - Sequential workflow, HTTP requests, templates
2. **User Validation** - Conditional branching, PostgreSQL queries
3. **Document Processing** - Parallel execution, fan-out/fan-in, file storage
4. **Content Moderation** - LLM with cost tracking, retry with backoff
5. **Research Assistant** - Multi-model fallback, budget-aware selection
6. **FAQ Bot / RAG** - Semantic caching, vector search, embeddings
7. **Agentic Research** - Iterative loops, agent patterns
8. **Scheduled Tasks** - Delays, rate limiting, scheduled execution
9. **Token Streaming** - Real-time LLM streaming via WebSocket
10. **Order Processing** - HTTP, database transactions, email notifications
11. **GitHub Health Check** - API integration, monitoring
12. **Sales ETL Pipeline** - Data transformation, ETL patterns
13. **Customer Churn Prediction** - ML workflow orchestration
14. **Document Intelligence** - Multi-step AI processing
15. **Content Moderation System** - Production-scale content review

**Recommendation**: Add a "Real-World Examples" section showcasing 3-4 concrete use cases with actual code from the examples:

**Example 1: Content Moderation System** (Example 15)
```yaml
activities:
  - key: moderate
    activity_name: llm_prompt
    parameters:
      model: anthropic/claude-sonnet-4-5
      prompt: "Review this content for policy violations..."
    settings:
      budget:
        limit_usd: 0.10
        action: abort
      retry:
        max_attempts: 3
        backoff_multiplier: 2
```

**Example 2: Multi-Document Processing** (Example 3)
```yaml
# Parallel fan-out pattern
activities:
  - key: process_docs
    activity_name: fan_out
    parallel:
      - validate_doc_1
      - validate_doc_2
      - validate_doc_3
  - key: combine_results
    depends_on: [process_docs]
```

**Example 3: Sales ETL Pipeline** (Example 12)
```yaml
# Cost-aware model fallback
activities:
  - key: analyze_sales
    activity_name: llm_prompt
    parameters:
      model:
        - anthropic/claude-sonnet-4-5  # Try first
        - openai/gpt-4o-mini            # Fallback if budget constrained
        - anthropic/claude-haiku-4      # Last resort
    settings:
      budget:
        limit_usd: 0.50
```

---

### 3. Target Audience Not Clear

**Status**: ✅ **IMPLEMENTED** (2026-02-05) — "Built For" persona cards added to hero section

**Priority**: HIGH (upgraded from MEDIUM based on external review) → COMPLETE

**Issue**: Landing page didn't explicitly call out who it's for. External reviewer feedback (2026-02-05): *"The flow of the details on the page has me questioning the target audience."* and *"As a PM, I want more insight into how costs are managed. So far this is for devs and CTOs."*

**Implementation**: Replaced hero stats grid (7.5MB, 93/sec, 328MB, 4+ providers) with three persona cards directly in the hero section:
- **AI startups** — Ship AI agents to production with built-in cost tracking and budget control. Survive crashes, stop runaway spend.
- **Small businesses** — Define workflows with no code, deploy one binary and one database: No cluster, no DevOps team. Production reliability for tens of dollars a month.
- **Data teams** — Combine batch pipelines and AI agents in one platform. Python SDK with pandas and DuckDB, and without a 4GB footprint or a $1K/M vendor lock-in.

**Remaining gap**: PM/business stakeholder perspective is still missing — cost tracking is described technically, not in terms of business outcomes (dashboards, reports, ROI)

The PM feedback is significant: the cost tracking value proposition is the #1 differentiator, but it's presented as developer tooling rather than business intelligence. A PM or VP Engineering evaluating Kruxia Flow would want to see: What does cost visibility actually *look like*? Can I get reports? Set alerts? Show my CFO a dashboard?

**From MVP requirements**, the primary personas are:

**P1: AI/ML Startup Engineer**
- Pain: Runaway LLM costs (multi-step agent tasks can cost $5–15+ each), complex deployment
- Success metrics: LLM cost reduction 50-80%, deploy time <1 hour
- *Note: The oft-cited "$14.40/task" AutoGPT figure (Jina AI, April 2023) was a theoretical worst-case estimate at GPT-4 launch pricing ($0.03/$0.06 per 1K tokens). Current pricing is significantly lower, but costs still spiral without tracking—especially with agent loops, retries, and multi-model chains.*

**P2: Platform Engineering Lead**
- Pain: Operational complexity of Temporal (7+ components, 8 eng-months/yr), infrastructure costs
- Success metrics: 60%+ infrastructure cost savings, 3x developer productivity

**P3: Edge Computing Architect**
- Pain: No orchestration works on edge devices, resource constraints
- Success metrics: Deploy on Raspberry Pi, 50MB RAM footprint

**P4: Product Manager / VP Engineering** (from external feedback)
- Pain: No visibility into AI spend across workflows, can't forecast costs
- Success metrics: Cost breakdowns per workflow, budget alerts, exportable reports

**Recommendation**: Two separate additions:

**A) "Built For" persona section** — after Problem or after Solution:

```html
<section>
  <h2>Built for AI teams who need</h2>
  <div class="three-column-grid">
    <div>
      <h3>Cost Controls</h3>
      <p>AI/ML startups running LLM workflows with zero cost visibility</p>
      <p class="stat">30–50% cost savings with visibility</p>
    </div>
    <div>
      <h3>Operational Simplicity</h3>
      <p>Platform teams drowning in Temporal's operational complexity</p>
      <p class="stat">60% infrastructure cost reduction</p>
    </div>
    <div>
      <h3>Edge Deployment</h3>
      <p>IoT architects who need orchestration on resource-constrained devices</p>
      <p class="stat">Runs on Raspberry Pi</p>
    </div>
  </div>
</section>
```

**B) Cost visibility for non-developers** — consider adding a cost report/dashboard mockup or JSON output example showing a cost breakdown that a PM could understand. The metrics API mention added to the Solution section (2026-02-05) is a start, but a visual example would be stronger.

---

### 4. Durable Execution Needs Explanation

**Status**: ⚡ **PARTIAL** (feature description exists, could add dedicated explainer)

**Priority**: HIGH → MEDIUM

**Current State**: The Solution/Features section includes a "Durable execution" feature card with description:
> "Workflows survive crashes, restart from where they left off, and guarantee exactly-once execution. Activities persist state and retry automatically with backoff. No more manual retry logic or lost progress."

This is good but could be more prominent and educational.

**Enhancement Opportunity**: Add a dedicated "What is Durable Execution?" callout box (can be collapsible/expandable) that provides before/after comparison.

**Recommendation**: Add an explainer callout (can be collapsible/expandable):

```html
<div class="explainer-callout">
  <h4>What is Durable Execution?</h4>
  <div class="two-column">
    <div>
      <h5>Without Durable Execution</h5>
      <ul>
        <li>Server crash = lost progress</li>
        <li>Manual retry logic in every workflow</li>
        <li>Complex state management</li>
        <li>No guarantee of completion</li>
      </ul>
    </div>
    <div>
      <h5>With Durable Execution</h5>
      <ul>
        <li>Workflows survive crashes</li>
        <li>Automatic retries with backoff</li>
        <li>State persisted in PostgreSQL</li>
        <li>Exactly-once execution guarantees</li>
      </ul>
    </div>
  </div>
  <p class="key-point">
    Durable execution means your workflow picks up exactly where it left off—
    whether it's a network blip, a server restart, or a full datacenter outage.
  </p>
</div>
```

Alternative: Add to the features section as a feature card with icon and explanation.

---

### 5. Missing the "Aha" Hook

**Priority**: MEDIUM

**Issue**: The problem section needs a compelling cost stat to make the pain visceral.

**⚠️ Note on $14.40 AutoGPT figure**: This was a theoretical worst-case estimate from Jina AI (April 2023) based on GPT-4 launch pricing. It assumed every step maxed out the 8K context window. GPT-4 pricing has dropped significantly since then. **Do not use this figure on the landing page.**

**Better approach**: Use general, defensible claims:
- "Multi-step agent tasks can cost $5–15+ each without controls"
- "Teams with cost observability report 30–50% savings" (currently used — this is strong)
- "Without budget enforcement, a single runaway agent loop can burn through your monthly budget"

The current Problem section uses the 30–50% savings stat, which is sourced from enterprise observability tool reports and is more defensible than a 3-year-old theoretical calculation.

---

### 6. Developer Experience

**Status**: ✅ **IMPLEMENTED** (Get Started section with terminal walkthrough)

**Priority**: HIGH → COMPLETE

**Original Issue**: The "Get Started" section was at the bottom. The incredible DX wasn't prominent.

**Implementation**: Added comprehensive "Get Started" section now positioned strategically between "Solution" and "Examples" sections:
- **"Running in 2 minutes"** headline
- **4-step walkthrough** with clear instructions (Clone → Token → Deploy → Track costs)
- **Full terminal code block** with actual commands from README
- **DX highlights section** showing:
  - ⚡ Python SDK (`pip install kruxiaflow`)
  - 📦 15+ Examples (production-ready patterns)
  - 🎯 Zero Complexity (no cluster, no Kafka)

**Current placement** (section order):
1. Hero
2. Problem
3. Solution/Features
4. **Get Started** ← positioned here
5. Examples
6. Comparison
7. Community

This positioning works well - visitors see the value prop first, then can immediately get started.

**Minor recommendation**: Consider duplicating a simplified "Quick Start" snippet in the hero section for maximum visibility.

```html
<section class="quick-start-highlight">
  <h2>Running in 2 minutes</h2>
  <div class="code-block">
    <pre>
git clone https://github.com/kruxia/kruxiaflow.git
cd kruxiaflow
./docker up --examples
# That's it. PostgreSQL included.
    </pre>
  </div>
  <div class="dx-highlights">
    <div>✓ Python SDK: pip install kruxiaflow</div>
    <div>✓ 15+ production-ready examples</div>
    <div>✓ No cluster. No Kafka. No complexity.</div>
  </div>
</section>
```

---

### 7. Performance Stats Could Be Stronger

**Priority**: MEDIUM

**Current**: Shows basic stats (7.5MB, 93/sec, 328MB, 4+ providers)

**Available from benchmarks** (README):

| Metric              | Kruxia Flow  | Temporal | Airflow |
|---------------------|--------------|----------|---------|
| Throughput (wf/sec) | **93**       | 66       | 8       |
| P99 Latency         | **0.9–1.5s** | 0.5–2.7s | 6–22s   |
| Peak Memory         | **328MB**    | 425MB    | 7.2GB   |
| Binary Size         | **7.5MB**    | ~200MB   | ~500MB+ |
| Docker Image        | **63MB**     | ~500MB   | ~1GB+   |

**Recommendation**: Update stats section to emphasize competitive advantages:

```html
<div class="stats-comparison">
  <div class="stat">
    <div class="number">93 <span class="vs">vs 66/8</span></div>
    <div class="label">Workflows/sec</div>
    <div class="context">vs Temporal / Airflow</div>
  </div>
  <div class="stat">
    <div class="number">63MB <span class="vs">vs 500MB/1GB</span></div>
    <div class="label">Docker Image</div>
    <div class="context">vs Temporal / Airflow</div>
  </div>
  <div class="stat">
    <div class="number">0.9s <span class="vs">vs 6-22s</span></div>
    <div class="label">P99 Latency</div>
    <div class="context">vs Airflow</div>
  </div>
  <div class="stat">
    <div class="number">Runs on Pi</div>
    <div class="label">Edge Deployment</div>
    <div class="context">Others require cluster</div>
  </div>
</div>
```

---

### 8. Comparison Table Missing Key Context

**Status**: ✅ **IMPLEMENTED** (2026-02-05)

**Priority**: MEDIUM → COMPLETE

**Original Issue**: The comparison table didn't explain why these competitors matter or what category Kruxia Flow competes in. External reviewer feedback: *"Should the comparison table show some areas that the others have that Kruxia Flow doesn't?"*

**Implementation**:
- **Intro paragraph** now positions Kruxia as a durable execution engine in the same category as Temporal and Inngest
- **Replaced Airflow column with Inngest** — the strongest direct competitor per strategic analysis
- **Renamed LangChain → LangGraph** — the actual comparable product
- **Added 3 "honest" rows** where competitors win:
  - **Proven scale**: Kruxia "New" vs Temporal "450K+ act/s" vs LangGraph "Klarna, Uber"
  - **SDK languages**: Kruxia "Python, YAML" vs Temporal "6 SDKs"
  - **Ecosystem**: Kruxia "New" vs Temporal "183K devs/wk" vs LangGraph "4.2M dl/mo"
- **Added "Self-host complexity" row** highlighting single-binary advantage
- **Footnote** explains LangSmith pricing, Inngest SSPL license, and that Temporal's binary size includes multi-language runtime and cluster coordination
- External reviewer noted *"The other systems are also slow because they are embedding other services"* — addressed in footnote acknowledging different feature scopes

---

### 9. Missing Python SDK and Language Support

**Priority**: MEDIUM

**Issue**: No mention of SDKs or how to build workers.

**From docs**:
- Python SDK available: `pip install kruxiaflow`
- Language-agnostic HTTP worker protocol
- Custom workers in any language
- Workers poll via API—no database access required

**Recommendation**: Add to features section:

```html
<div class="feature">
  <div class="icon">🔌</div>
  <div>
    <h3>Language-agnostic workers</h3>
    <p>
      Built-in Python SDK (<code>pip install kruxiaflow</code>).
      HTTP worker protocol means write custom workers in any language.
    </p>
    <p>
      Workers poll via API—no database access required.
      Deploy workers anywhere, scale horizontally with zero coordination overhead.
    </p>
  </div>
</div>
```

Also consider adding code example:

```python
# Python worker example
from kruxiaflow import Worker

worker = Worker(
    api_url="http://localhost:8080",
    activity_types=["my_custom_activity"],
)

@worker.activity("my_custom_activity")
async def process(params):
    # Your custom logic here
    return {"result": "success"}

worker.run()
```

---

### 10. AGPL License Implications Not Clear

**Priority**: LOW

**Issue**: Says "OPEN SOURCE · AGPL-3.0" but doesn't explain what this means for users.

**Recommendation**: Add clarity in the community section or footer:

```html
<div class="license-explainer">
  <h3>Truly Open Source</h3>
  <p>
    <strong>AGPL-3.0 licensed.</strong> Self-host anywhere.
    No vendor lock-in, no usage limits, no surprise pricing.
  </p>
  <p class="details">
    Use freely for internal tools. If you build a commercial service on top,
    contribute back or contact us about commercial licensing.
  </p>
</div>
```

---

## Current Landing Page Structure

**Current page flow** (as of 2026-02-05):

1. **Hero** ✅ IMPLEMENTED (updated 2026-02-05)
   - "Durable AI workflows, built-in cost controls"
   - "The only durable workflow engine built for AI"
   - "Built For" persona cards: AI startups, Small businesses, Data teams

2. **Problem Section** ✅ IMPLEMENTED (updated 2026-02-05)
   - 3 problem cards sharpened with strategic analysis data:
     - "Invisible AI spend" — 30-50% savings stat, no native tracking
     - "Temporal's operational tax" — 7+ components, 8 eng-months/yr, Airflow $360+/mo
     - "LangGraph isn't a workflow engine" — Python-only, proprietary platform, ~$1K/1M executions

3. **Solution / Features** ✅ IMPLEMENTED (updated 2026-02-05)
   - 5 key features with icons and descriptions
   - Code example showing workflow.yaml with budget settings
   - Cost tracking now mentions metrics API for dashboards and alerts
   - Durable execution, cost tracking, budget enforcement, model fallback, deploy anywhere

4. **Get Started** ✅ IMPLEMENTED (recently moved here)
   - "Running in 2 minutes" with 4-step walkthrough
   - Full terminal code block with actual commands
   - DX highlights: Python SDK, 15+ examples, zero complexity

5. **Examples** ✅ IMPLEMENTED
   - 4 tabbed examples: Weather Report, Content Moderation, Sales ETL, Churn Prediction
   - Each with description, code snippets, and GitHub links
   - Shows both no-code (YAML) and Python SDK approaches

6. **Comparison Table** ✅ IMPLEMENTED (updated 2026-02-05)
   - Kruxia vs Temporal vs Inngest vs LangGraph (replaced Airflow with Inngest, renamed LangChain → LangGraph)
   - Features: durable execution, LLM cost tracking, budgets, fallback, streaming, self-host complexity, performance, license
   - Honest rows where competitors win: proven scale, SDK languages, ecosystem (Kruxia shown as "New")
   - Intro paragraph positions Kruxia as durable execution engine vs Temporal/Inngest
   - Footnote acknowledges different feature scopes in performance comparisons

7. **Community** ✅ IMPLEMENTED
   - GitHub, Discord, Bluesky links
   - AGPL-3.0 license mentioned in hero

**This structure is strong.** The flow logically moves from problem → solution → getting started → examples → comparison.

**Suggested enhancements**:
1. Add "What is Durable Execution?" explainer (collapsible box in Solution section)
2. ~~Add competitive context to hero stats~~ — stats replaced with persona cards
3. ~~Add target persona cards~~ — ✅ implemented in hero section
4. Consider brief quick-start snippet in hero section

---

## Implementation Progress Summary

### ✅ Fully Implemented (10/10 original high-priority items + persona cards)

1. **Hero positioning** - "Durable AI workflows, built-in cost controls"
2. **"Built For" persona cards** - AI startups, Small businesses, Data teams (replaced stats grid)
3. **Problem section** - 3 clear problem cards
4. **Solution/features** - 5 feature cards with code example
5. **Get Started section** - Complete terminal walkthrough with 4 steps
6. **DX highlights** - Python SDK, 15+ examples, zero complexity
7. **Production examples** - 4 tabbed examples (no-code + Python SDK)
8. **Comparison table** - vs Temporal, Inngest, LangGraph (MIT licenses highlighted)
9. **Community section** - GitHub, Discord, Bluesky links
10. **Target persona clarity** - Visitors can immediately identify if this is for them

### ⚡ Partially Implemented

11. **Durable execution explanation** - Feature description exists, could add dedicated explainer

### 🆕 Remaining Recommendations

12. **Worker model explanation** - Language-agnostic HTTP protocol
13. **PM/business stakeholder cost perspective** - Dashboard mockup, cost report, business outcomes
14. **AGPL license clarity** - Brief explainer on what it means

---

## High-Priority Content Additions

### 1. Durable Execution Explainer

**Why it matters**: Core differentiator that many developers don't understand.

**Suggested content**:
```
Durable Execution Means Your Workflows Can't Fail

❌ Without Durable Execution:
- Server crashes = lost progress
- Complex retry logic in every workflow
- Manual state management
- Hope nothing goes wrong

✓ With Durable Execution:
- Workflows survive crashes and restarts
- Activities retry automatically with backoff
- State persisted in PostgreSQL
- Exactly-once execution guarantees

Your workflow picks up exactly where it left off—whether it's a network
blip, a server restart, or a full datacenter outage.
```

---

### 2. Real-World Use Case Section

**Example structure**:

```html
<section class="use-cases">
  <h2>Production-Ready Examples</h2>
  <p>15+ example workflows included, covering common patterns</p>

  <div class="use-case-grid">
    <!-- Use Case 1 -->
    <div class="use-case">
      <h3>Content Moderation at Scale</h3>
      <p>Process user-generated content with LLM review, cost budgets, and automatic retries</p>
      <div class="code-snippet">
        <pre>
settings:
  budget:
    limit_usd: 0.10
    action: abort
  retry:
    max_attempts: 3
    backoff_multiplier: 2
        </pre>
      </div>
      <a href="#">View full example →</a>
    </div>

    <!-- Use Case 2 -->
    <div class="use-case">
      <h3>Multi-Document Processing</h3>
      <p>Parallel fan-out pattern processes hundreds of documents simultaneously</p>
      <div class="code-snippet">
        <pre>
activities:
  - key: process_batch
    parallel:
      - validate_doc_1
      - validate_doc_2
      # ... scales to 100s
  - key: combine
    depends_on: [process_batch]
        </pre>
      </div>
      <a href="#">View full example →</a>
    </div>

    <!-- Use Case 3 -->
    <div class="use-case">
      <h3>Sales Analytics Pipeline</h3>
      <p>Budget-aware model fallback ensures workflows complete within cost limits</p>
      <div class="code-snippet">
        <pre>
model:
  - anthropic/claude-sonnet-4-5
  - openai/gpt-4o-mini      # fallback
  - anthropic/claude-haiku-4 # last resort
        </pre>
      </div>
      <a href="#">View full example →</a>
    </div>
  </div>
</section>
```

---

### 3. Worker Model Explanation

**Why it matters**: Clarifies deployment model and shows flexibility.

**Suggested content**:
```
Build Workers in Any Language

Kruxia Flow workers use a simple HTTP polling protocol—no database access needed.

Built-in Python SDK:
  pip install kruxiaflow

Or build your own in any language:
  1. Poll /api/v1/workers/poll for activities
  2. Execute your custom logic
  3. POST results to /api/v1/activities/{id}/complete

Workers can run:
  ✓ Anywhere (edge, cloud, on-prem)
  ✓ In any language (Python, Go, Rust, Node.js)
  ✓ Scaled horizontally with zero coordination
```

---

### 4. Target Persona Callouts

**Why it matters**: Helps visitors immediately identify if this is for them.

**Suggested content**:
```html
<section class="for-you">
  <h2>Is Kruxia Flow right for you?</h2>

  <div class="persona-grid">
    <div class="persona">
      <h3>AI/ML Startup</h3>
      <div class="pain">Your LLM costs are unpredictable and growing</div>
      <div class="solution">
        ✓ Track every token<br>
        ✓ Set hard budget limits<br>
        ✓ 50-80% cost reduction
      </div>
      <div class="stat">AutoGPT: $14.40/task → Controlled: $2-3/task</div>
    </div>

    <div class="persona">
      <h3>Platform Team</h3>
      <div class="pain">Temporal's operational complexity is crushing your team</div>
      <div class="solution">
        ✓ Single 7.5MB binary<br>
        ✓ PostgreSQL only<br>
        ✓ 60% infrastructure cost savings
      </div>
      <div class="stat">4+ services → 1 binary + PostgreSQL</div>
    </div>

    <div class="persona">
      <h3>Edge/IoT Team</h3>
      <div class="pain">No orchestration solution runs on your devices</div>
      <div class="solution">
        ✓ 328MB peak memory<br>
        ✓ Runs on Raspberry Pi<br>
        ✓ Offline-capable with sync
      </div>
      <div class="stat">First orchestrator designed for edge</div>
    </div>
  </div>
</section>
```

---

## Content Enhancements for Existing Sections

### Hero Section

**Current** (post-update):
```
Durable AI workflows need
built-in cost controls

Kruxia Flow is the only durable workflow engine built for AI.
Not only do workflows survive crashes, AI costs are budgeted,
tracked, and reported. And it runs anywhere in a 7.5 MB binary.
```

**Suggested enhancement**:
Consider adding a brief one-liner that captures the full value prop:
```
Track every token. Control every cost. Deploy anywhere.
```

Or highlight the key differentiator more explicitly:
```
The only workflow engine that won't let you exceed your AI budget.
```

---

### Stats Section

**Current**:
- 7.5MB Binary Size
- 93/sec Workflows
- 328MB Peak Mem
- 4+ LLM Providers

**Suggested enhancement** (add context):
- **7.5MB** Binary Size *(vs Temporal: 200MB)*
- **93/sec** Workflows *(vs Temporal: 66, Airflow: 8)*
- **328MB** Peak Memory *(vs Airflow: 7.2GB)*
- **Runs on Pi** *(Others: Require cluster)*

---

### Features Section

**Current features** (good):
1. Built-in cost tracking
2. Budget enforcement
3. Automatic model fallback
4. Durable execution
5. Deploy anywhere

**Suggested additions**:
6. **Python SDK** - `pip install kruxiaflow` and start building
7. **Language-agnostic** - Write workers in any language via HTTP
8. **Token streaming** - Real-time LLM output via WebSocket
9. **15+ Examples** - Production-ready workflows included

---

## Quick Wins (Low Effort, High Impact)

1. **Add DX callout** - Show the 2-minute setup prominently
2. **Add "What is durable execution?" explainer** - 2-3 sentences with before/after
3. **Enhance stats with competitive context** - Add "vs Temporal/Airflow" labels
4. **Link to examples** - Change generic YAML to real example with link
5. **Add persona pain points** - 3 cards: AI startup, Platform team, Edge team

---

## Medium-Effort Additions

1. **Real-world use cases section** - 3-4 examples with actual code
2. **Worker model explanation** - How to build custom workers
3. **Performance benchmarks section** - Expand stats into dedicated section
4. **Comparison category explanation** - Context above comparison table

---

## Long-Term Content Strategy

### Documentation Landing Pages

Consider creating dedicated landing pages for:
- **/examples** - Interactive examples with live demos
- **/benchmarks** - Detailed performance comparisons
- **/vs/temporal** - Head-to-head comparison
- **/vs/airflow** - Migration guide
- **/use-cases** - Industry-specific examples

### Social Proof

When available, add:
- User testimonials (especially around cost savings)
- Case studies (AI startup saved $X/month)
- Community metrics (GitHub stars, Discord members)
- Logo wall (companies using Kruxia Flow)

### Interactive Elements

Consider adding:
- **Cost calculator** - "How much are your AI workflows costing you?"
- **Interactive demo** - Try a workflow in the browser
- **Architecture diagram** - Hover to explore components

---

## Metrics to Track Post-Launch

To validate content improvements:

1. **Engagement metrics**:
   - Time on page
   - Scroll depth
   - Click-through rate on "Get Started"

2. **Conversion metrics**:
   - GitHub stars from landing page
   - Discord joins from landing page
   - README views after landing page visit

3. **Understanding metrics** (via user research):
   - Can visitors explain what Kruxia Flow does?
   - Do they understand "durable execution"?
   - Do they recognize their use case?

---

## External Feedback Log

### Feedback Round 1 (2026-02-05) — Product reviewer

| Feedback | Status | Notes |
|----------|--------|-------|
| "Questioning the target audience" | 🔴 Open | No persona section. Upgraded to HIGH priority. See Finding #3. |
| Headline typo "track[s]" | ✅ Fixed | Headline rewritten in earlier revision |
| Comparison table should show competitor strengths | ✅ Fixed | Added Proven scale, SDK languages, Ecosystem rows with Kruxia as "New" |
| "Other systems slow because they embed other services" | ✅ Fixed | Footnote added re: different feature scopes |
| "As a PM, I want more insight into cost management" | ⚡ Partial | Metrics API mention added to Solution section. Still needs PM-facing content (dashboards, reports, business outcomes). See Finding #3. |
| "As a CTO/Dev, I like Running in under 5 minutes" | ✅ Present | "Running in 2 minutes" section |
| "Why do bullet points change from gold to grey?" | ✅ Fixed | All checkmarks consistently amber |

---

## Conclusion

The landing page v2 is comprehensive and well-structured, with the majority of content recommendations implemented and validated by external feedback.

**✅ Successfully Implemented (as of Feb 5, 2026)**:

1. **Positioning**: Hero correctly frames Kruxia Flow as durable execution engine with AI-native features
2. **Problem section**: Sharpened with competitive data from strategic analysis (Temporal 7+ components, Airflow $360+/mo, LangGraph proprietary platform)
3. **Concrete examples**: 4 tabbed production-ready examples (no-code YAML + Python SDK)
4. **Developer experience**: Full "Get Started" section with terminal walkthrough and DX highlights
5. **Feature showcase**: 5 key features with code examples; cost tracking now mentions metrics API
6. **Comparison table**: Honest positioning vs Temporal, Inngest, LangGraph — includes rows where competitors win (proven scale, SDK languages, ecosystem)
7. **Section flow**: Logical progression from problem → solution → getting started → examples → comparison
8. **Performance stats**: Binary size, throughput, memory, provider count
9. **Footnotes**: Acknowledge different feature scopes in performance comparisons, LangSmith pricing, Inngest licensing

**Remaining Opportunities for Enhancement**:

**Medium Priority**:
1. **Add PM/business stakeholder perspective on costs** — dashboard mockup, cost report example, or business outcome framing. The cost story is told technically; needs a business lens.
2. Add "What is Durable Execution?" explainer callout (2-3 sentences, can be collapsible)
3. Add worker model and SDK explanation (language-agnostic HTTP protocol)

**Low Priority**:
4. AGPL licensing implications explainer
5. Social proof when available (testimonials, case studies)
6. Interactive elements (cost calculator, live demo)

**Overall Assessment**: The landing page now presents an honest, well-supported competitive position backed by data from the strategic analysis. The comparison table builds credibility by acknowledging where competitors lead (ecosystem, SDK breadth, proven scale) while clearly differentiating on AI-native features. The "Built For" persona cards in the hero section address the biggest remaining gap identified by external feedback — visitors can now immediately identify if Kruxia Flow is for them. The remaining gap is **PM/business stakeholder perspective** — the cost story is told technically rather than in terms of business outcomes.
