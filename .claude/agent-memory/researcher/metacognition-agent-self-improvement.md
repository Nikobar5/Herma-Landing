---
name: metacognition-agent-self-improvement
description: Research findings on AI agent metacognition: temporal awareness, correction tracking, task prioritization, async communication, and memory consolidation. Concrete implementable patterns.
type: reference
---

## 1. Temporal Awareness

**Core Problem**: LLMs cannot internally track elapsed time. Models achieved only 4% deal closure under time pressure without explicit temporal signals, vs 32% with per-turn remaining-time updates (arXiv 2601.13206). Turn limits (5-9 utterances) yielded 98-100% because discrete units map to token generation; continuous time does not.

**Implementable Patterns**:
- Inject per-turn remaining-time as a textual prefix on every message (not just initial context)
- Frame time constraints as discrete unit limits ("you have 3 more tool calls") rather than wall-clock deadlines
- Use qualitative urgency cues ("urgent", "final pass") alongside or instead of numeric countdowns
- Store commitment timestamps in persistent state and diff against `now` at the start of each session
- Temporal awareness requires explicit architectural support — it does not emerge from scale

**Data Structure for Time-Bounded Commitments**:
```json
{
  "commitment_id": "uuid",
  "description": "...",
  "committed_at": "ISO8601",
  "deadline": "ISO8601",
  "turns_remaining": 3,
  "urgency_level": "high|medium|low",
  "status": "pending|in_progress|completed|overdue"
}
```

---

## 2. Correction Tracking

**Best Schema** (from OpenAI Self-Evolving Agents cookbook + error taxonomy research arXiv 2603.06847):

```json
{
  "correction_id": "uuid",
  "timestamp": "ISO8601",
  "session_id": "...",
  "dimension": "cognition|tooling|memory|runtime|reliability",
  "symptom_class": "data_validation|execution|code_quality|agent_specific|error_handling|llm_specific|tool_call|...",
  "root_cause": "...",
  "user_correction": "verbatim quote or paraphrase",
  "rule_extracted": "DO/DON'T statement for future behavior",
  "recurrence_count": 0,
  "graduated_to_rule": false,
  "rule_file": null
}
```

**5 Architectural Fault Dimensions** (from taxonomy of 375 real agentic faults):
1. Agent Cognition & Orchestration (planning, lifecycle, control flow)
2. Tooling, Integration & Actuation (API calls, resource handling)
3. Perception, Context & Memory (input interpretation, state persistence)
4. Runtime & Environment Grounding (dependencies, platform)
5. System Reliability & Observability (error recovery, robustness)

**Recurrence Prevention Loop**:
1. Capture correction → categorize by dimension + symptom class
2. Extract rule in DO/DON'T form
3. Write rule to correction log with `recurrence_count: 0`
4. On each session start, load corrections and inject as few-shot examples
5. When `recurrence_count >= 3` → graduate to `.claude/rules/` permanent file
6. Use Error Taxonomy-Guided Prompt Optimization: analyze correction log weekly, augment system prompts with guidance targeting the most frequent failure modes

**Key insight**: Logging alone doesn't prevent recurrence. The corrections must be injected at session start as behavioral constraints, not just stored for reference.

---

## 3. Task Prioritization Under Persistent Objective

**The Busywork Trap**: Agents default to measurable-but-low-impact tasks (formatting, reorganizing, commenting code) because they're completable and feel productive. Anti-pattern identified across multiple frameworks.

**OKR-Based Task Filtering** (from quasa.io + OKR tools research):
- Define the top-level goal as an OKR: Objective + 3-5 measurable Key Results
- Before starting any task, ask: "Which Key Result does this advance, and by how much?"
- Tasks that cannot be traced to a Key Result are deprioritized or dropped
- Redefine vague goals: "increase revenue" → "acquire first paying customer by 2026-04-15"

**Task Scoring Formula** (derived from multi-criteria decision analysis patterns):
```
score = (goal_impact * 0.5) + (reversibility * 0.2) + (validation_speed * 0.2) + (compound_value * 0.1)
```
Where each factor is 0-1. High score = do first.

**Task Generation Protocol**:
1. Read current Key Results and their progress metrics
2. Identify the KR furthest from target
3. Generate 3-5 candidate tasks that directly move that KR
4. Score each against the formula
5. Execute highest-scoring task
6. After completion, re-measure the KR — did it actually move?

**Circuit Breaker for Low-ROI Tasks**: If a completed task did not measurably advance any KR, log it as "busywork incident" and do not start similar tasks without explicit justification.

---

## 4. Asynchronous Human Communication

**A2H Protocol Schema** (arXiv 2602.15831) — production-grade standard for agent-to-human messages:
```json
{
  "type": "QUESTION | CONFIRMATION | ALERT | REPORT",
  "summary": "one-line TL;DR — readable in 5 seconds",
  "body": "markdown-formatted detail",
  "actions": [
    {"label": "Approve", "value": "approve"},
    {"label": "Deny", "value": "deny"}
  ]
}
```

**Channel Adaptation (UMA layer)**:
- Slack/Teams: render as interactive cards with buttons
- SMS/Signal: summary field only, truncated to 160 chars
- Email: full body with HTML rendering

**Conciseness Principles**:
- Summary field must be readable in <5 seconds — one sentence, outcome not process
- Use symbols for status: `✓` done, `⏳` blocked, `→` next
- Visual-first: attach screenshot/image before text explanation for UI changes
- Never list files changed — show outcomes and metrics instead
- Structure as: [what's done] + [key metric] + [what's blocked] + [what's next]

**Async Discipline**:
- Never send more than one message per task cycle (batch updates)
- Fire-and-forget: send, continue working, do not wait for response
- Use structured response options so human reply is a single click, not a composition task

---

## 5. Memory Consolidation

**A-MEM Architecture** (NeurIPS 2025, arXiv 2502.12110) — most rigorous current framework:

Memory note structure:
```python
{
  "content": str,          # raw interaction
  "timestamp": ISO8601,
  "keywords": [str],       # LLM-generated
  "tags": [str],           # LLM-generated categorical labels
  "context_description": str,  # LLM-generated semantic summary
  "embedding": vector,     # dense via text encoder
  "links": [note_id]       # connections to related memories
}
```

Storage: ChromaDB (vector similarity) + NetworkX (explicit typed relationships)

**Active Context Compression / Sawtooth Pattern** (arXiv 2601.07190):
- Context grows during exploration, collapses at consolidation checkpoints
- Agent calls `start_focus("task description")` at investigation start
- Agent calls `complete_focus()` when done; system generates summary of: attempted actions, learned facts, task outcome
- Summary appended to persistent Knowledge block; raw history between checkpoints is deleted
- Compression frequency: every 10-15 tool calls with aggressive prompting
- Driven by prompt-based behavioral guidance, not algorithmic thresholds

**Pruning Strategy (Intelligent Decay)**:
Score each memory on composite: `recency_weight + relevance_to_current_goal + utility_frequency`
- Recency: exponential decay with half-life tuned to session length
- Relevance: cosine similarity to current objective embedding
- Utility: how many times this memory has been retrieved and used

**Practical Consolidation Rules**:
1. Topic files over inline memory — store in structured files, not context window
2. Index (MEMORY.md) must stay under 200 lines — aggressively summarize
3. When a memory is accessed 3+ times in different sessions, promote to a rule file
4. When a memory hasn't been accessed in 10+ sessions, archive or delete
5. After every major task completion, run a consolidation pass: what did you learn that's reusable?

**AgeMem Unified Framework** (arXiv 2601.01885): exposes memory operations as tool-based actions — the agent explicitly calls `store_memory()`, `retrieve_memory()`, `update_memory()`, `summarize_memory()`, `discard_memory()`. Makes memory management a first-class agent behavior rather than background infrastructure.
