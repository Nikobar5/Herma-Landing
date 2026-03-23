---
name: Claude Code Agent Hierarchy Research
description: Current limitations on nested/hierarchical subagents in Claude Code and the Claude Agent SDK, plus all known workarounds. Researched 2026-03-22.
type: reference
---

## Hard Limits (as of March 2026)

- **Subagents cannot spawn subagents.** The Agent/Task tool is not exposed inside a subagent's tool list. This is confirmed by GitHub Issue #4182 (closed as duplicate).
- **Teammates (Agent Teams) also cannot spawn anything.** Teammates lack the Agent tool, TeamCreate/Delete tools, and CronCreate tools. Hub-and-spoke only — all spawning must go through the team lead.
- **No nested teams.** Documented limitation in Agent Teams docs: "teammates cannot spawn their own teams or teammates."
- The Agent SDK explicitly states: "Subagents cannot spawn their own subagents. Don't include Agent in a subagent's tools array."

## Available Tiers

| Context | Can spawn subagents? | Can create teams? |
|---------|---------------------|-------------------|
| Main session | Yes (via Agent tool) | Yes (experimental) |
| Subagent | No | No |
| Teammate | No | No |

## Known Workarounds

### 1. `claude -p` via Bash (hacky, not recommended)
Subagents can call `claude -p "prompt"` through the Bash tool to spawn non-interactive Claude instances. Drawbacks: no visibility, no structured output, no context sharing, resource management chaos, inconsistent behavior.

### 2. File-Based Coordination (shared state pattern)
Use shared files as a coordination layer:
- Orchestrator writes task specs to JSON/YAML files
- Workers (subagents or claude -p processes) read and write results to files
- Orchestrator reads results and decides next steps
- Effectively simulates hierarchy through filesystem as message bus

### 3. MCP Server as Coordination Layer
- `claude-code-mcp` (steipete): Exposes Claude Code as an MCP tool, enabling agent-in-agent patterns where a primary LLM delegates to Claude Code as a specialized subprocess
- `agent-collab-mcp`: SQLite-backed MCP with task state machine (assigned → in-progress → review → done), structured reviews, and role-based agent configuration
- Enables a higher-level model to orchestrate lower-level Claude Code instances

### 4. Agent Teams (experimental, recommended for peer coordination)
- Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- Team lead can spawn teammates; teammates communicate peer-to-peer via mailbox
- NOT hierarchical — it's a flat team with a designated lead
- Best for parallel work where agents need to talk to each other (research, competing hypotheses, cross-layer changes)
- Token cost is high (each teammate = full context window)

### 5. Claude Agent SDK (programmatic, Python/TypeScript)
- Allows programmatic definition of subagents with `agents` parameter in `query()`
- Same flat limit applies: subagents cannot be given the Agent tool
- Supports dynamic agent factory patterns (create different agents at runtime based on conditions)
- Supports subagent resumption via session IDs
- Useful for building orchestration systems OUTSIDE of Claude Code (custom pipelines)

### 6. Orchestration via External Framework
- LangGraph + Claude Agent SDK for graph-based multi-agent flows
- Ruflo platform: hierarchical queen/worker swarms with collective decision-making
- Build your own orchestrator in Python/TypeScript that calls Claude API and dispatches tasks

## Recommended Architecture for True Hierarchy

The cleanest pattern that doesn't fight the platform:

```
Main session (Orchestrator)
├── Spawns subagent A → writes results to /tmp/agent-a-results.json
├── Spawns subagent B → writes results to /tmp/agent-b-results.json
└── Spawns subagent C (coordinator role):
    - Reads A and B results from files
    - Runs its own analysis
    - Writes synthesis to /tmp/synthesis.json
Main session reads synthesis and continues
```

For true multi-level hierarchy, move to the Agent SDK or an external orchestrator.

## Sources
- https://github.com/anthropics/claude-code/issues/4182 (Task tool not in subagent)
- https://github.com/anthropics/claude-code/issues/32731 (teammates have fewer tools than documented)
- https://platform.claude.com/docs/en/agent-sdk/subagents (official SDK subagent docs)
- https://code.claude.com/docs/en/agent-teams (official agent teams docs)
- https://github.com/steipete/claude-code-mcp (MCP server workaround)
- https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea (swarm orchestration patterns)
