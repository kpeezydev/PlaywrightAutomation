# Playwright Automation Framework

[![Playwright Tests](https://github.com/your-org/playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-org/playwright-automation/actions/workflows/playwright.yml)

E2E and API test automation framework built with Playwright, TypeScript, and the Page Object Model. Tests target [SauceDemo](https://www.saucedemo.com) (UI) and [DummyJSON](https://dummyjson.com) (API).

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Java JRE 8+** — required for Allure report generation
- **npm** (included with Node.js)

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests (UI + API)
npm test

# Run tests with interactive UI mode
npm run test:ui
```

## Directory Structure

| Path                       | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `tests/feature/UI/`        | Browser E2E tests + BDD feature files against SauceDemo                  |
| `tests/feature/API/`       | API tests + BDD feature files against DummyJSON                          |
| `tests/playwright/API/`    | Auto-generated Playwright spec files from API BDD features (gitignored)  |
| `tests/playwright/UI/`     | Auto-generated Playwright spec files from UI BDD features (gitignored)   |
| `steps/`                   | BDD step definitions + shared fixtures               |
| `pages/`                   | Page Object Model classes (LoginPage, CheckoutPage)  |
| `utils/`                   | ApiClient wrapper, Winston-based TestLogger          |
| `test-data/`               | Factory classes + shared constants and URLs          |
| `allure-results/`          | Raw Allure test results (generated, gitignored)      |
| `allure-report/`           | Generated Allure HTML report (gitignored)            |
| `report_<timestamp>/`      | Generated Allure HTML report from local scripts      |

## How It Works

Tests flow through a multi-layer pipeline:

```
.feature (Gherkin)  →  .spec.js (auto-generated)  →  Playwright runner
      ↓                        ↓                            ↓
  tests/feature/         tests/playwright/           steps/*.steps.ts
                                                           ↓
                                              pages/*.ts  →  healing/locator.ts
                                              utils/*.ts      (self-healing on failure)
                                              test-data/*.ts  (factories + constants)
```

1. **Feature files** (`tests/feature/UI/` or `API/`) define scenarios in Gherkin syntax
2. **playwright-bdd** auto-generates Playwright spec files on every run (stored in `tests/playwright/`, gitignored)
3. Each Gherkin step maps to a **step definition** in `steps/*.steps.ts`, which imports `{ Given, When, Then }` from `steps/fixtures.steps.ts`
4. Step definitions delegate to **Page Objects** (`pages/`) and **utilities** (`utils/`)
5. **Self-healing locators** catch element-not-found errors and use Gemini AI to find replacement selectors, cached in `healing-store.json`
6. **Winston logger** records every step, request, and error to `logs/combined.log` and `logs/error.log`
7. **Allure** produces raw results in `allure-results/` for visual reporting

The `steps/fixtures.steps.ts` file acts as the wiring hub — it creates the BDD `test` fixture, registers the self-healing system, and exports `{ Given, When, Then }`. All step files import from here.

## When Something Goes Wrong

Check these in order when a test fails:

| What | Where | Why |
|---|---|---|
| **Allure report** | `npm run allure:report` | Steps, screenshots, parameters per scenario |
| **Playwright trace** | `test-results/<name>-trace.zip` | Full step-by-step replay via `npx playwright show-trace` |
| **Logs** | `logs/combined.log` / `logs/error.log` | Search for `[ERR]`, `[STEP]`, or the test name |
| **Screenshots/videos** | `test-results/` | Visual evidence captured on failure |
| **Healing store** | `healing-store.json` | Check `confidence` of healed locators |
| **CI artifacts** | GitHub Actions run page | Download `allure-report` or `playwright-report` artifacts |

**Common failures and fixes:**

- **Locator not found** → Self-healing triggers automatically. If it fails, check `logs/combined.log` for `[STEP] Starting healing`. Delete `healing-store.json` to force re-healing on next run.
- **Gemini API key missing** → Set `GEMINI_API_KEY` in `.env` or CI secrets. Without it, self-healing is disabled and locator failures become hard failures.
- **BDD step not matched** → The step text in your `.feature` file has no corresponding `Given/When/Then(...)` in `steps/*.steps.ts`. The error message lists the unmatched step. Add the missing step definition.
- **API assertion failing** → Check `[REQ]` and `[RES]` entries in `logs/combined.log` for the full request/response body.
- **Timeout** → Default test timeout is 60s (accounts for Gemini API latency). Try running just the failing test with `npx playwright test --project=bdd-ui -g "scenario name"`.

## What to Adjust

### Adding a new UI test scenario
1. Add a scenario to an existing `.feature` file in `tests/feature/UI/` or create a new one
2. Write step definitions in the relevant `steps/*.steps.ts` file — import `{ Given, When, Then }` from `@/steps/fixtures.steps`
3. If the step needs a new page interaction, add a method to the relevant class in `pages/`
4. Add test constants in `test-data/constants.ts` and factory methods in `test-data/factories.ts` if needed
5. Run `npm run test:bdd` — spec files regenerate automatically

### Adding a new page object
1. Create a file in `pages/` (e.g., `CartPage.ts`)
2. Use `healingLocator(page, '[data-test="..."]', { elementContext: '...' })` for elements users interact with
3. Use `page.locator(...)` directly for read-only elements (assertions, headers)
4. Wire the page object into your step definitions

### Adding a new API endpoint
1. Add the URL to `test-data/constants.ts` under the `URLS` object
2. Add a factory method in `UrlFactory` in `test-data/factories.ts`
3. Use `apiRequest(request, apiContext, $testInfo, { method, url, data })` from `utils/api-helper.ts` in your step definitions

### Modifying an existing locator
- **Let self-healing handle it** — if the DOM changes, the AI finds a replacement automatically on next failure
- To force re-healing: delete `healing-store.json`
- To auto-patch source files: set `HEALING_PATCH_SOURCE=true` in `.env` (healed selectors are written back to page object files)

### Configuration changes
- **Timeouts, projects, retries** → `playwright.config.ts` at the project root
- **CI/CD pipeline** → `.github/workflows/playwright.yml`
- **TypeScript paths (`@/`)** → `tsconfig.json`
- **Env vars** → Copy `.env.example` to `.env` and fill in values

## Available Commands

| Command                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `npm test`                 | Run all UI and API tests (legacy + BDD)              |
| `npm run test:ui`          | Open Playwright interactive UI mode                  |
| `npm run test:bdd`         | Run only BDD tests (project filter)                  |
| `npm run test:bdd:ui`      | Open Playwright UI mode for BDD tests                |
| `npm run test:bdd:grep`    | Run BDD tests matching a grep pattern                |
| `npm run test:allure`      | Run tests and auto-generate Allure report            |
| `npm run allure:generate`  | Generate Allure HTML report from latest results      |
| `npm run allure:open`      | Open the latest Allure report in browser             |
| `npm run allure:report`    | Generate and open Allure report (convenience)        |
| `npm run lint`             | Run ESLint checks                                    |
| `npm run lint:fix`         | Fix auto-fixable lint issues                         |
| `npm run format`           | Format code with Prettier                            |
| `npx playwright test -g`   | Run specs matching a grep pattern                    |

## BDD Tests

This project uses [playwright-bdd](https://vitalets.github.io/playwright-bdd/) to write and run BDD tests with Gherkin `.feature` files. The BDD layer sits on top of the existing Page Objects, fixtures, and utilities — no logic is duplicated.

- Feature files: `tests/feature/API/` and `tests/feature/UI/` organized by test type
- Step definitions: `steps/` (`*.steps.ts`) that delegate to existing page objects, utilities, and factories
- Generated test files: `playwright/API/` and `playwright/UI/` (auto-generated, gitignored)

To add a new BDD scenario:
1. Create a `.feature` file under `tests/feature/API/` or `tests/feature/UI/`
2. Create or update a `.steps.ts` file in `steps/` with matching step definitions
3. Run `npm run test:bdd` to verify (test files are auto-generated on run)

## CI/CD

Tests run automatically via **GitHub Actions** on every push and pull request. The workflow:

1. Runs all tests (UI + API) on `ubuntu-latest`
2. Generates Allure HTML report from raw results
3. Uploads `allure-results` and `allure-report` as build artifacts
4. Deploys the Allure report to **GitHub Pages** with trend history preserved

## AI Agent Context

This project includes [`AGENTS.md`](./AGENTS.md) — a detailed guide for AI coding agents. It covers directory conventions, command usage, path aliases, fixtures, and CI setup. Human contributors should start here; AI agents should reference `AGENTS.md`.

## Path Aliases

TypeScript path alias `@/*` maps to `./*` for clean imports (e.g., `@/pages/LoginPage`). Configured in `tsconfig.json`.
