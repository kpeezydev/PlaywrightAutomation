# AGENTS.md — Playwright AI Framework

> **For human onboarding, see [`README.md`](./README.md).** This file targets AI coding agents.

## Project

Single-package Playwright test project. No monorepo. No framework scaffolding beyond `@playwright/test` + TypeScript.

## Directory map

| Path                       | Purpose                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `tests/feature/UI/`        | Browser E2E tests + BDD feature files against https://www.saucedemo.com                              |
| `tests/feature/API/`       | API tests + BDD feature files against https://dummyjson.com                                          |
| `tests/playwright/API/`          | Auto-generated Playwright spec files from API BDD features (gitignored)                              |
| `tests/playwright/UI/`           | Auto-generated Playwright spec files from UI BDD features (gitignored)                               |
| `steps/`                   | Step definition files (`*.steps.ts`) + shared BDD fixtures (`fixtures.steps.ts`)                     |
| `pages/`                   | Page Object Model classes (LoginPage, CheckoutPage, etc)                                             |
| `utils/`                   | `ApiClient` (Playwright `APIRequestContext` wrapper), `logger` (Winston-based `TestLogger`)          |
| `test-data/`               | Factory classes (`UserFactory`, `CheckoutDataFactory`, `ApiTestDataFactory`) + shared constants/URLs |
| `allure-results/`  | Raw Allure test result files (gitignored, generated on every run) |
| `allure-report/` | Generated Allure HTML report in CI (gitignored, created by `npx allure generate` in GitHub Actions) |
| `report_<timestamp>/` | Generated Allure HTML report (gitignored, created by `scripts/generate-allure-report.js`) |

## Commands

```bash
npm test                         # runs all UI + API specs (legacy + BDD)
npm run test:ui                  # interactive UI mode
npm run test:bdd                 # runs only BDD tests (--project=bdd)
npm run test:bdd:ui              # interactive UI mode for BDD tests
npm run test:bdd:grep            # BDD tests matching a grep pattern (e.g., npm run test:bdd:grep -- "Login")
npm run test:allure              # runs tests + auto-generates Allure report (report_<timestamp>)
npm run allure:generate          # generate Allure HTML report from allure-results/ (report_<timestamp>)
npm run allure:open              # open the latest report_* directory in browser
npm run allure:report            # generate + open (convenience shortcut)
npx playwright test -g "Login"   # run specs matching a grep pattern
npm run lint                     # eslint (.eslintrc.js, strict via tsconfig)
npm run lint:fix                 # eslint --fix
npm run format                   # prettier --write .
```

> Run lint/format with `npm run…`. Running `npx playwright…` directly bypasses nothing but is fine for ad-hoc execution.
> Allure CLI requires Java 8+ (JRE) to be installed on the system. Report generation scripts depend on it.
> Report generation uses `scripts/generate-allure-report.js`; opening the latest uses `scripts/open-latest-allure-report.js`.

## Path alias

`tsconfig.json` maps `@/*` → `./*`. All internal imports use this alias (e.g. `@/pages/LoginPage`). Keep it; Playwright and ts-node resolve it via the config file at the project root.

## Test target

- **UI tests**: `baseURL = https://www.saucedemo.com` is set in `playwright.config.ts`. Page objects call `page.goto('/')` — do not hardcode the full URL in page objects.
- **API tests**: Use `@playwright/test` `request` fixture + `utils/ApiClient`. Bypasses `baseURL`; construct full URLs in the test or via `UrlFactory`.

## Fixtures

`fixtures/auth.fixture.ts` extends Playwright's base test with `authenticatedPage`. A test using this fixture starts already logged in as `standard_user / secret_sauce` (URL confirmed at `inventory.html`). Use the fixture name `authenticatedPage` instead of rolling your own login in the test body.

## Test data

All credentials and payloads live in `test-data/constants.ts`. Tests import from factory classes in `test-data/factories.ts`. Do not embed literal credentials inline in spec files.

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

## Code Style

### Python Best Practices

#### Formatting
- Follow PEP 8 — 4-space indentation, 79-char line limit
- Use `black` for formatting, `isort` for imports

#### Naming
- `snake_case` for variables/functions, `PascalCase` for classes, `UPPER_CASE` for constants
- Descriptive names — `user_count` not `n`

#### Types
- Type hint all function signatures
```python
  def get_user(user_id: int) -> dict[str, str]:
```

#### Functions
- One function = one responsibility
- Keep functions short and focused

#### Error Handling
- Catch specific exceptions, never bare `except:`
- Use `with` statements for resource cleanup

#### Patterns
- Prefer comprehensions over `map`/`filter`
- Use generators for large datasets

**Code readability priority** — Favor clarity and intent-revealing code over brevity or cleverness. Use descriptive names, avoid deeply nested logic, extract meaningful helper functions, and keep functions focused on a single responsibility. Readability is the default; optimize for the next reader, not the writer.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
