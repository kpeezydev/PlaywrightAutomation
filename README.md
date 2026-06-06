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
| `tests/UI/`                | Browser E2E tests + BDD feature files against SauceDemo                  |
| `tests/API/`               | API tests + BDD feature files against DummyJSON                          |
| `playwright/API/`          | Auto-generated Playwright spec files from API BDD features (gitignored)  |
| `playwright/UI/`           | Auto-generated Playwright spec files from UI BDD features (gitignored)   |
| `steps/`                   | BDD step definitions + shared fixtures               |
| `pages/`                   | Page Object Model classes (LoginPage, CheckoutPage)  |
| `fixtures/`                | Custom Playwright fixtures (`authenticatedPage`)     |
| `utils/`                   | ApiClient wrapper, Winston-based TestLogger          |
| `test-data/`               | Factory classes + shared constants and URLs          |
| `allure-results/`          | Raw Allure test results (generated, gitignored)      |

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

## BDD Tests

This project uses [playwright-bdd](https://vitalets.github.io/playwright-bdd/) to write and run BDD tests with Gherkin `.feature` files. The BDD layer sits on top of the existing Page Objects, fixtures, and utilities — no logic is duplicated.

- Feature files: `tests/feature/API/` and `tests/feature/UI/` organized by test type
- Step definitions: `steps/` (`*.steps.ts`) that delegate to existing page objects, utilities, and factories
- Generated test files: `playwright/API/` and `playwright/UI/` (auto-generated, gitignored)

To add a new BDD scenario:
1. Create a `.feature` file under `tests/API/` or `tests/UI/`
2. Create or update a `.steps.ts` file in `steps/` with matching step definitions
3. Run `npx bddgen test` to regenerate test files, then `npm run test:bdd` to verify

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
