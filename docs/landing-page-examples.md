# Landing Page Real-World Examples

These 4 examples showcase Kruxia Flow's capabilities: 2 using only built-in activities (no code), 2 with Python scripts (running in the provided py-std worker).

---

## Example 1: Weather Report Pipeline

**Use Case**: Sequential workflow with HTTP requests and email notifications

**Target Personas**: SMBs, Data Engineers new to Kruxia Flow, Developers

**Business Value**: Build production workflows without writing any code. Fetch data from APIs, transform with templates, send notifications.

### Why This Example

- **Zero code required**: Uses only built-in activities
- **Simple to understand**: Clear sequential flow
- **Shows HTTP integration**: Real external API calls
- **Practical use case**: Everyone needs to integrate APIs

### Key Differentiators Shown

✓ **No Python worker needed** - Built-in `http_request` and `email_send` activities
✓ **Template engine** - Transform API responses without code
✓ **Sequential workflow** - Clear dependency chain
✓ **Durable execution** - Survives crashes between steps

### Code Snippet

```yaml
activities:
  - key: fetch_weather
    activity_name: http_request
    parameters:
      url: "https://api.weather.gov/gridpoints/TOP/31,80/forecast"
      method: GET
      headers:
        User-Agent: "kruxiaflow-demo"

  - key: format_report
    activity_name: template
    parameters:
      template: |
        Weather for {{INPUT.location}}:
        {{OUTPUT.fetch_weather.properties.periods[0].detailedForecast}}
    depends_on: [fetch_weather]

  - key: send_email
    activity_name: email_send
    parameters:
      to: "{{INPUT.recipient}}"
      subject: "Daily Weather Report"
      body: "{{OUTPUT.format_report}}"
    depends_on: [format_report]
```

### Files

- **Workflow Definition**: [`py/examples/01_weather_report.py.yaml`](../py/examples/01_weather_report.py.yaml)
- **Worker Implementation**: [`py/examples/01_weather_report.py`](../py/examples/01_weather_report.py) *(optional - shows how to run it)*

### Messaging for Landing Page

> **"Build Workflows Without Writing Code"**
>
> This entire workflow uses built-in activities: fetch from HTTP API, format with templates, send email. No Python workers, no custom code. Just YAML.

---

## Example 2: Content Moderation System

**Use Case**: Production-scale content review with LLM cost controls

**Target Personas**: AI Startups, SMBs with user-generated content

**Business Value**: Review user content for policy violations with guaranteed cost limits. No surprise bills, automatic retries on transient failures.

### Why This Example

- **Zero code required**: Uses only `llm_prompt` built-in activity
- **Shows budget enforcement clearly**: Hard $0.10 limit per review
- **Production-ready pattern**: Retry logic with exponential backoff
- **Real-world AI**: Actual business problem, not a toy example

### Key Differentiators Shown

✓ **Budget enforcement** - Workflow aborts before exceeding $0.10
✓ **LLM cost tracking** - See exactly what each review costs
✓ **Automatic retries** - Handles transient API failures gracefully
✓ **No Python worker needed** - Built-in LLM activity handles everything

### Code Snippet

```yaml
activities:
  - key: moderate
    activity_name: llm_prompt
    parameters:
      model: anthropic/claude-sonnet-4-5
      prompt: |
        Review this content for policy violations:

        Content: {{INPUT.user_content}}

        Respond with JSON: {"safe": true/false, "reason": "..."}
      max_tokens: 500
    settings:
      budget:
        limit_usd: 0.10      # Hard limit
        action: abort         # Stop if exceeded
      retry:
        max_attempts: 3
        backoff_multiplier: 2 # 1s, 2s, 4s

  - key: take_action
    activity_name: http_request
    parameters:
      url: "{{INPUT.callback_url}}"
      method: POST
      body: "{{OUTPUT.moderate}}"
    depends_on: [moderate]
```

### Files

- **Workflow Definition**: [`py/examples/15_content_moderation_system.py.yaml`](../py/examples/15_content_moderation_system.py.yaml)
- **Worker Implementation**: [`py/examples/15_content_moderation_system.py`](../py/examples/15_content_moderation_system.py) *(optional)*

### Messaging for Landing Page

> **"AI Workflows Without Code"**
>
> Set a $0.10 budget limit and let the built-in LLM activity handle everything—no Python worker required. The workflow guarantees it won't exceed your budget, even if the LLM tries to generate 10,000 tokens.

---

## Example 3: Sales ETL Pipeline

**Use Case**: AI-powered data analytics with budget-aware model selection

**Target Personas**: Data Engineers, AI Startups doing analytics

**Business Value**: Transform sales data and generate insights using AI, with automatic fallback to cheaper models when budget is constrained.

### Why This Example

- **Shows Python scripts**: Data transformation logic (runs in provided py-std worker)
- **AI + Data Engineering convergence**: Shows both worlds together
- **Budget-aware model fallback**: The killer feature for AI cost control
- **Recognizable ETL pattern**: Data engineers know this workflow

### Key Differentiators Shown

✓ **Python scripts in YAML** - For data transformation logic (no worker deployment needed)
✓ **Budget-aware model fallback** - Try expensive model first, fall back to cheaper
✓ **Multi-provider support** - Claude → GPT → Haiku chain
✓ **SQL + Python + LLM** - Full stack in one workflow

### Code Snippet

```yaml
activities:
  - key: extract_sales
    activity_name: postgres_query
    parameters:
      query: |
        SELECT product, region, SUM(revenue) as total
        FROM sales
        WHERE date >= {{INPUT.start_date}}
        GROUP BY product, region

  - key: transform_data
    activity_name: py-std
    parameters:
      script: |
        def normalize_and_aggregate(data):
            # Your custom Python logic here
            return transformed_data
      function: "normalize_and_aggregate"
      data: "{{OUTPUT.extract_sales}}"
    depends_on: [extract_sales]

  - key: generate_insights
    activity_name: llm_prompt
    parameters:
      model:
        - anthropic/claude-sonnet-4-5  # Try first (best quality)
        - openai/gpt-4o-mini            # Fallback if budget tight
        - anthropic/claude-haiku-4      # Last resort (cheapest)
      prompt: |
        Analyze these sales trends and recommend actions:
        {{OUTPUT.transform_data}}
    settings:
      budget:
        limit_usd: 0.50
        action: fallback  # Try next model in list
    depends_on: [transform_data]

  - key: save_report
    activity_name: postgres_query
    parameters:
      query: |
        INSERT INTO sales_reports (date, insights, cost_usd)
        VALUES (NOW(), {{OUTPUT.generate_insights}}, {{COST.generate_insights}})
    depends_on: [generate_insights]
```

### Files

- **Workflow Definition**: [`py/examples/12_sales_etl_pipeline.py.yaml`](../py/examples/12_sales_etl_pipeline.py.yaml)
- **Python Script**: [`py/examples/12_sales_etl_pipeline.py`](../py/examples/12_sales_etl_pipeline.py) *(runs in provided py-std worker)*

### Messaging for Landing Page

> **"Add Python Scripts - No Worker Deployment Needed"**
>
> Extract from SQL, transform with Python (inline or via SDK), analyze with LLM. Scripts run in the provided py-std worker—no deployment, no infrastructure. If budget is tight, automatically fall back from Claude Sonnet → GPT-4o-mini → Claude Haiku.

---

## Example 4: Customer Churn Prediction

**Use Case**: ML workflow orchestration with parallel model training and LLM insights

**Target Personas**: Data Engineers, AI/ML Startups, Data Scientists

**Business Value**: Predict which customers will churn, train multiple models in parallel, and use LLM to explain the predictions in business terms.

### Why This Example

- **Shows Python scripts for ML**: ML training code (runs in provided py-std worker)
- **Parallel execution**: Train 3 models simultaneously
- **ML + LLM convergence**: Traditional ML plus AI insights
- **Clear business value**: Reduce customer churn = revenue retention

### Key Differentiators Shown

✓ **Python scripts for ML** - Write training code, runs in provided py-std worker
✓ **Parallel model training** - Run multiple experiments simultaneously
✓ **Durable execution** - Long-running training survives crashes
✓ **ML + LLM orchestration** - Train models, then explain with Claude

### Code Snippet

```yaml
activities:
  - key: feature_engineering
    activity_name: py-std
    parameters:
      script_ref: "ml_pipeline.prepare_features"
      data_source: "{{INPUT.customer_data}}"

  - key: train_models
    parallel:
      - key: train_random_forest
        activity_name: py-std
        parameters:
          script_ref: "ml_pipeline.train_model"
          model_type: "random_forest"
          features: "{{OUTPUT.feature_engineering}}"

      - key: train_gradient_boost
        activity_name: py-std
        parameters:
          script_ref: "ml_pipeline.train_model"
          model_type: "gradient_boost"
          features: "{{OUTPUT.feature_engineering}}"

      - key: train_neural_net
        activity_name: py-std
        parameters:
          script_ref: "ml_pipeline.train_model"
          model_type: "neural_net"
          features: "{{OUTPUT.feature_engineering}}"
    depends_on: [feature_engineering]

  - key: select_best_model
    activity_name: py-std
    parameters:
      script_ref: "ml_pipeline.evaluate_and_select"
      models: "{{OUTPUT.train_models}}"
    depends_on: [train_models]

  - key: explain_predictions
    activity_name: llm_prompt
    parameters:
      model: anthropic/claude-sonnet-4-5
      prompt: |
        These customers are predicted to churn:
        {{OUTPUT.select_best_model.top_risks}}

        Explain in business terms why they're at risk and suggest retention strategies.
      max_tokens: 1000
    settings:
      budget:
        limit_usd: 0.25
    depends_on: [select_best_model]
```

### Files

- **Workflow Definition**: [`py/examples/13_customer_churn_prediction.py.yaml`](../py/examples/13_customer_churn_prediction.py.yaml)
- **Python Script**: [`py/examples/13_customer_churn_prediction.py`](../py/examples/13_customer_churn_prediction.py) *(runs in provided py-std worker)*

### Messaging for Landing Page

> **"Orchestrate ML Training - No Infrastructure Needed"**
>
> Train 3 models in parallel with Python scripts. Everything runs in the provided py-std worker—no deployment, no servers. If your server crashes during a 2-hour training run, the workflow picks up exactly where it left off. Then use Claude to explain the predictions in plain English.

---

## Summary: Why These 4 Examples

| Example | Activities | Python Scripts? | Key Message |
|---------|------------|-----------------|-------------|
| **Weather Report** | HTTP, Email, Templates | ❌ No | "Build workflows without code" |
| **Content Moderation** | LLM with budgets | ❌ No | "AI workflows without code" |
| **Sales ETL Pipeline** | SQL, py-std, LLM | ✅ Yes | "Add Python when needed" |
| **Customer Churn** | py-std ML training | ✅ Yes | "ML with no infrastructure" |

### Coverage

**Built-in Activities (No Code Required):**
- ✅ HTTP requests (Weather Report)
- ✅ Email notifications (Weather Report)
- ✅ Templates (Weather Report)
- ✅ LLM with budgets (Content Moderation)
- ✅ SQL queries (Sales ETL)

**Python Scripts (in provided py-std worker):**
- ✅ Data transformation (Sales ETL)
- ✅ ML model training (Customer Churn)
- ✅ Complex business logic
- ✅ No worker deployment needed

**Key Features:**
- ✅ **Budget enforcement** - Examples 2, 3
- ✅ **Durable execution** - All 4 examples
- ✅ **Parallel execution** - Example 4
- ✅ **Multi-provider** - Example 3
- ✅ **Sequential flows** - Examples 1, 2
- ✅ **No-code workflows** - Examples 1, 2
- ✅ **Python scripts** - Examples 3, 4 (no infrastructure needed)

### Personas Addressed

✅ **AI Startups** - Examples 2, 3, 4 (cost control, ML orchestration)
✅ **Data Engineers** - Examples 1, 3, 4 (ETL, ML, API integration)
✅ **SMBs** - Examples 1, 2 (practical workflows, no code needed)
✅ **Developers** - All examples (clear progression from simple to complex)

---

## The py-std Worker Advantage

**This is a MAJOR differentiator from other workflow engines.**

With Kruxia Flow, you **never deploy custom workers**:
- ✅ Write Python scripts (inline in YAML or via SDK)
- ✅ Scripts run in the **provided py-std worker**
- ✅ No deployment, no servers, no infrastructure
- ✅ Same durability and cost controls as built-in activities

**Competitors require:**
- ❌ Build and deploy custom worker services
- ❌ Manage worker infrastructure
- ❌ Handle scaling, versioning, monitoring

**Kruxia Flow:**
- ✅ We provide the py-std worker
- ✅ You just write Python code
- ✅ Zero operational overhead

**Landing Page Callout:**
> "Write Python when you need to. We provide the worker. You provide the code. No deployment, no infrastructure, no overhead."

---

## Two-Tier Messaging Strategy

### Tier 1: "Start Simple - No Code Required"

**Examples 1 & 2** show you can build production workflows with zero Python code:

> "Build workflows in minutes, not days. Use built-in activities for HTTP, SQL, LLM, and email. Deploy to production without writing a single line of code."

**Code snippet for landing page:**
```yaml
# No Python required - just built-in activities
activities:
  - key: fetch
    activity_name: http_request

  - key: analyze
    activity_name: llm_prompt
    settings:
      budget:
        limit_usd: 0.10

  - key: notify
    activity_name: email_send
```

### Tier 2: "Add Python When Needed - No Infrastructure Required"

**Examples 3 & 4** show when you need custom logic, add Python scripts:

> "Need data transformation or ML training? Write Python scripts (inline or via SDK). They run in the provided py-std worker—no deployment, no servers, no infrastructure."

**Code snippet for landing page:**
```yaml
# Python scripts run in provided py-std worker
activities:
  - key: transform
    activity_name: py-std
    parameters:
      script: |
        def transform(data):
            # Your Python logic here
            return processed_data
      function: "transform"

  - key: analyze
    activity_name: llm_prompt
    depends_on: [transform]
```

---

## Landing Page Section Structure

```html
<section class="real-world-examples">
  <div class="intro">
    <h2>Production-Ready Examples</h2>
    <p>15+ workflows included. Start with built-in activities, scale to custom Python workers.</p>
  </div>

  <!-- Tier 1: No Code Required -->
  <div class="tier tier-no-code">
    <h3>No Code Required</h3>
    <p>Build production workflows with built-in activities</p>

    <div class="examples-grid">
      <!-- Example 1: Weather Report -->
      <div class="example-card">
        <span class="badge">HTTP + Email</span>
        <h4>Weather Report</h4>
        <p>Fetch API, format, send email—zero code</p>
        <div class="code-snippet"><!-- YAML --></div>
        <a href="#">View example →</a>
      </div>

      <!-- Example 2: Content Moderation -->
      <div class="example-card">
        <span class="badge">LLM + Budgets</span>
        <h4>Content Moderation</h4>
        <p>AI review with $0.10 hard limit—zero code</p>
        <div class="code-snippet"><!-- YAML --></div>
        <a href="#">View example →</a>
      </div>
    </div>
  </div>

  <!-- Tier 2: Python Scripts -->
  <div class="tier tier-python-scripts">
    <h3>Add Python Scripts</h3>
    <p>Write Python when needed—runs in provided py-std worker, no deployment required</p>

    <div class="examples-grid">
      <!-- Example 3: Sales ETL -->
      <div class="example-card">
        <span class="badge">SQL + Python + LLM</span>
        <h4>Sales ETL Pipeline</h4>
        <p>Custom transform + budget-aware AI</p>
        <div class="code-snippet"><!-- YAML --></div>
        <a href="#">View example →</a>
      </div>

      <!-- Example 4: Customer Churn -->
      <div class="example-card">
        <span class="badge">ML Orchestration</span>
        <h4>Customer Churn Prediction</h4>
        <p>Parallel ML training + LLM insights</p>
        <div class="code-snippet"><!-- YAML --></div>
        <a href="#">View example →</a>
      </div>
    </div>
  </div>

  <div class="cta">
    <a href="https://github.com/kruxia/kruxiaflow/tree/main/py/examples">
      View all 15+ examples on GitHub →
    </a>
  </div>
</section>
```

---

## Messaging Variations for Hero/Taglines

Based on these examples:

**No-Code Tier:**
1. **"Build AI workflows without writing code"** (Examples 1 & 2)
2. **"From API to AI in pure YAML"** (Examples 1 & 2)
3. **"HTTP + LLM + Email = Zero lines of Python"** (Examples 1 & 2)

**Python Scripts Tier:**
4. **"Write Python. We provide the worker."** (Examples 3 & 4 - KEY DIFFERENTIATOR)
5. **"ML training that survives crashes—no infrastructure"** (Example 4)
6. **"Budget-aware AI analytics—no worker deployment"** (Example 3)
7. **"From simple HTTP to complex ML—zero operational overhead"** (All 4 examples)

**Universal:**
8. **"Start simple, scale to sophisticated"** (Progression from 1 → 4)
9. **"No deployment, no servers, no overhead"** (py-std worker advantage)

---

## Key Differentiators Highlighted

Across these 4 examples, visitors see:

1. **No code required for common patterns** (HTTP, LLM, SQL, Email)
2. **Budget enforcement** - Never exceed AI costs
3. **Python scripts when needed** - No worker deployment or infrastructure required
4. **Durable execution** - All workflows survive crashes
5. **Parallel execution** - ML model training
6. **Multi-provider LLM** - Claude, GPT, Haiku
7. **Simple to sophisticated** - Clear learning path
8. **Provided py-std worker** - Write Python, we handle execution

This two-tier approach (no-code → Python scripts) makes Kruxia Flow approachable for beginners while showing power users it can handle their complex needs—without operational overhead.
