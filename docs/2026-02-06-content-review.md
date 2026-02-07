# Content Review — 2026-02-06

Reviewer feedback on `kruxiaflow-landing.html` with analysis and recommended improvements.

---

## 1. Legal term: "guarantee exactly-once execution"

**Location:** Features section, Durable execution description (line 362)

**Current text:**
> Workflows survive crashes, restart from where they left off, and guarantee exactly-once execution.

**Issue:** "Guarantee" is a legal term that creates liability. The reviewer suggests "complete" or "produce" instead.

**Recommendation:** Reword to avoid the legal claim while keeping the technical meaning. Options:

- "...and **deliver** exactly-once execution."
- "...and **provide** exactly-once execution."
- "...and **ensure** exactly-once execution."

"Deliver" is the strongest option that avoids legal liability while preserving confidence in the claim.

---

## 2. "Runs on a Raspberry Pi or your cloud"

**Location:** Features section, Deploy anywhere description (line 392)

**Current text:**
> A 7.5 MB binary with PostgreSQL. Runs on a Raspberry Pi or your cloud. No cluster required.

**Reviewer suggestion:**
> Runs on your cloud, on-premise, or edge computing: Raspberry Pi Zero to NVIDIA Jetson

**Recommendation:** Adopt the reviewer's phrasing. It is stronger because:
- Leads with the most common deployment target (cloud)
- Adds on-premise, which is important for enterprise / regulated industries
- "NVIDIA Jetson to Raspberry Pi" paints a concrete edge-computing spectrum
- Signals that the binary runs on ARM and x86 alike

**Proposed text:**
> A 7.5 MB binary with PostgreSQL. Runs anywhere: on cloud VMs, on-premise computers, or edge devices like Raspberry Pi Zero.

---

## 3. Trademark disclaimer

**Issue:** The page references multiple third-party trademarks: Claude, GPT, Sonnet, Haiku, Opus (Anthropic); LangGraph, LangSmith (LangChain); Temporal; Airflow (Apache); Inngest; PostgreSQL; Raspberry Pi; NVIDIA Jetson; DuckDB; Rust; Python; Bluesky.

**Recommendation:** Add a brief trademark disclaimer in the footer. Standard practice for product landing pages that reference competitors or third-party products. Something like:

> All product names, logos, and brands are property of their respective owners. Use of these names does not imply endorsement.

This is a single line added to the footer — low effort, removes risk.

---

## 4. Line break before "Until now"

**Location:** Problem section subtitle (lines 303–304)

**Current text (single `<p>`):**
> You need durable execution, cost controls, and operational simplicity. Until now you had to pick one, or none.

**Recommendation:** Insert a `<br/>` before "Until" to create a visual pause that strengthens the pivot from problem statement to Kruxia's value proposition:

```html
<p class="text-lg text-text-secondary leading-relaxed">
  You need durable execution, cost controls, and operational simplicity.<br/>
  Until now you had to pick one, or none.
</p>
```

The line break turns "Until now you had to pick one, or none." into a standalone punchline.

---

## 5. "SMBs" — write out "Small and Medium-size Business"

**Location:** Weather Report example, bullet point (line 609)

**Current text:**
> Ideal for SMBs and data engineers

**Recommendation:** Spell it out on first use. "SMB" is well-known in B2B tech circles but not universally understood, and the landing page targets a broad audience including small business owners who may not self-identify with the acronym.

**Proposed text:**
> Ideal for small & medium businesses and data engineers

---

## 6. AGPL-3.0 vs. MIT in codebase

**Location:** Hero badge (line 246) and comparison table (line 955) both say AGPL-3.0.

**Issue:** The reviewer notes that MIT is still listed throughout the develop branch codebase.

**Resolution:** This is intentional dual licensing. The Rust server is AGPL-3.0, but the Python SDK (used as the basis for user workflows and custom workers) is MIT/Apache. Users should not be required to open-source their own workflow code just because they import the SDK. The MIT/Apache references in the Python SDK codebase are correct and should remain.

The landing page correctly shows AGPL-3.0, which refers to the core server project. No changes needed to the landing page or the SDK licensing.

**Action item (codebase):** Verify that license references are correct per component — AGPL-3.0 for the Rust server, MIT/Apache for the Python SDK. Fix any that are misattributed, but do not blanket-update everything to AGPL-3.0.

---

## 7. Python SDK vs. 7.5 MB binary message

**Issue:** The reviewer asks whether mentioning the Python SDK undercuts the "7.5 MB binary" / "single executable" messaging.

**Analysis:** The reviewer's own assessment is correct — it does not. The 7.5 MB figure describes the Rust server binary. The Python SDK is a client-side package that talks to the server over HTTP. They are separate deployment artifacts:

- **Server:** 7.5 MB Rust binary + PostgreSQL
- **Client (optional):** `pip install kruxiaflow` Python SDK

**Recommendation:** No change needed to the landing page. The current presentation is clear: the binary size and "deploy anywhere" messaging refer to the server. The Python SDK appears in the "Get Started" section as a developer tool, not a deployment dependency. If desired, a parenthetical could be added to the Python SDK card: "(client library — the server is the 7.5 MB binary)" — but this may over-explain.

---

## 8. K icon linking to Kruxia Consulting

**Location:** Logo in navbar (line 205) and footer (line 1017), both link to `/`.

**Issue:** Should the K logo link to a Kruxia Consulting landing page for development consulting services?

**Recommendation:** This is a business/brand decision. Options:

- **Option A: Keep as-is.** The K logo links to `/` (kruxiaflow.com homepage). Clean, expected behavior. Users looking for consulting can be directed via a separate link.
- **Option B: Add a "Consulting" or "Kruxia" link in the footer.** The footer already has Docs, License, Contributing. Adding a "Kruxia Consulting" link there keeps the logo behavior standard while providing a path to the consulting page.
- **Option C: Link the logo to kruxia.com.** This would be unusual — users expect a logo click to reload the current site, not navigate away.

**Recommended: Option B** — add a footer link to the Kruxia Consulting site. Keep the logo pointing to `/`.

---

## 9. GET_STARTED section and nav restructuring

**Issue:** The reviewer notes the GET_STARTED section is powerful, but "Production-ready patterns" (the Examples section) can get lost. They suggest restructuring the nav header to surface more sections.

**Current nav items:** Features | Comparison | Docs

**Analysis:** The page has these major sections in order:
1. Hero
2. Problem
3. **Features** (nav link)
4. **Get Started** (no nav link)
5. **Examples** ("Production-ready patterns") (no nav link)
6. **Comparison** (nav link)
7. Community

The reviewer is right — Get Started and Examples are both high-value sections with no nav representation.

**Recommendation:** Expand the nav to surface the key sections:

```
Features | Get Started | Examples | Comparison | Docs
```

This:
- Surfaces the powerful GET_STARTED section in the nav
- Gives "Production-ready patterns" (Examples) its own nav entry so it doesn't get lost
- Keeps Comparison and Docs where they are
- Maintains a logical flow: what it does > how to start > see examples > how it compares > read docs

The `href` values would be `#features`, `#getstarted`, `#examples`, `#comparison`, and the external Docs link.

---

## Summary of changes

| # | Item | Type | Effort |
|---|------|------|--------|
| 1 | "guarantee" -> "deliver" exactly-once | Copy edit | Low |
| 2 | Expand "Deploy anywhere" description | Copy edit | Low |
| 3 | Add trademark disclaimer to footer | New content | Low |
| 4 | Line break before "Until now" | Formatting | Low |
| 5 | Spell out "SMBs" | Copy edit | Low |
| 6 | Audit codebase for MIT references | Codebase task | Medium |
| 7 | Python SDK vs binary — no change needed | N/A | None |
| 8 | Add Kruxia Consulting link to footer | New link | Low |
| 9 | Expand nav: Features, Get Started, Examples, Comparison, Docs | Nav restructure | Low |
