# AGENTS.md — Playwright AI Framework

> **For human onboarding, see [`README.md`](./README.md).** This file targets AI coding agents.

## Project

Single-package Playwright test project. No monorepo. No framework scaffolding beyond `@playwright/test` + TypeScript.

## Directory map

| Path                       | Purpose                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `tests/UI/`                | Browser E2E tests against https://www.saucedemo.com                                                  |
| `tests/API/`               | API tests against https://dummyjson.com                                                              |
| `pages/`                   | Page Object Model classes (LoginPage, CheckoutPage, etc)                                             |
| `fixtures/auth.fixture.ts` | Custom fixture: `authenticatedPage` auto-logs in as `standard_user`                                  |
| `utils/`                   | `ApiClient` (Playwright `APIRequestContext` wrapper), `logger` (Winston-based `TestLogger`)          |
| `test-data/`               | Factory classes (`UserFactory`, `CheckoutDataFactory`, `ApiTestDataFactory`) + shared constants/URLs |
| `allure-results/`  | Raw Allure test result files (gitignored, generated on every run) |
| `allure-report/` | Generated Allure HTML report in CI (gitignored, created by `npx allure generate` in GitHub Actions) |
| `report_<timestamp>/` | Generated Allure HTML report (gitignored, created by `scripts/generate-allure-report.js`) |

## Commands

```bash
npm test                         # runs all UI + API specs
npm run test:ui                  # interactive UI mode
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

## Code style

TypeScript strict mode (`strict: true`), `no-floating-promises: error`, `no-explicit-any: warn`.  
Prettier: single quotes, trailing commas, 2-space indent, printWidth 100, semicolons enforced. ESLint's prettier integration is active — run `npm run lint:fix` before committing formatting changes.
