# AGENTS.md — Playwright AI Framework

> **For human onboarding, see [`README.md`](./README.md).** This file targets AI coding agents.

## Keeping these files current

When you add a new directory, page object, fixture, utility, factory, or any other significant structure, update this file — especially the **Directory map** section. If purpose or location changes, keep it in sync so agents always have an accurate project map.

Keep `README.md` in sync whenever you add, remove, or change commands, project structure, or any information a human onboarding would need. AGENTS.md targets AI agents; README.md targets humans — both must stay accurate.

## Working environment

| Parameter        | Value              |
| ---------------- | ------------------ |
| Operating System | Windows 11         |
| IDE              | Visual Studio Code |
| IDE Terminal     | PowerShell 7+      |

## CI / CD — GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs on push, pull request, and manual dispatch.

**Allure reporting in CI:**
- Tests produce raw results in `allure-results/`
- The test job generates the Allure HTML report (`allure-report/`) and uploads two artifacts: `allure-results` (raw data) and `allure-report` (HTML report)
- A separate `deploy` job (dependent on `test`) downloads `allure-results`, pulls history from the `gh-pages` branch, generates the report via `npx allure generate`, and deploys to GitHub Pages
- The Allure report on Pages preserves history across runs for trend charts

**Setup required:**
- GitHub Pages must be enabled in repo Settings > Pages > Source: "GitHub Actions"
- Java JRE 8+ is required for the Allure CLI (pre-installed on `ubuntu-latest`)
- The workflow requires `contents: write`, `pages: write`, and `id-token: write` permissions in the deploy job

## Avoid duplication

Check existing code before writing new code. Reuse and extend before creating. If a pattern already exists—same logic, same selector, same helper—use it rather than duplicating it. Extract shared logic into utilities or factories when you find yourself repeating yourself.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
