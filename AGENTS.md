# AGENTS.md — Playwright AI Framework

## Project

Single-package Playwright test project. No monorepo. No framework scaffolding beyond `@playwright/test` + TypeScript.

## Directory map

| Path                       | Purpose                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `tests/UI/`                | Browser E2E tests against https://www.saucedemo.com                                                  |
| `tests/API/`               | API tests against https://dummyjson.com                                                              |
| `pages/`                   | Page Object Model classes (LoginPage, CheckoutPage, etc)                                             |
| `fixtures/auth.fixture.ts` | Custom fixture: `authenticatedPage` auto-logs in as `standard_user`                                  |
| `utils/`                   | `ApiClient` (Playwright `APIRequestContext` wrapper)                                                 |
| `test-data/`               | Factory classes (`UserFactory`, `CheckoutDataFactory`, `ApiTestDataFactory`) + shared constants/URLs |

## Commands

```bash
npm test                         # runs all UI + API specs
npm run test:ui                  # interactive UI mode
npx playwright test -g "Login"   # run specs matching a grep pattern
npm run lint                     # eslint (.eslintrc.js, strict via tsconfig)
npm run lint:fix                 # eslint --fix
npm run format                   # prettier --write .
```

> Run lint/format with `npm run…`. Running `npx playwright…` directly bypasses nothing but is fine for ad-hoc execution.

## Path alias

`tsconfig.json` maps `@/*` → `./*`. All internal imports use this alias (e.g. `@/pages/LoginPage`). Keep it; Playwright and ts-node resolve it via the config file at the project root.

## Test target

- **UI tests**: `baseURL = https://www.saucedemo.com` is set in `playwright.config.ts`. Page objects call `page.goto('/')` — do not hardcode the full URL in page objects.
- **API tests**: Use `@playwright/test` `request` fixture + `utils/ApiClient`. Bypasses `baseURL`; construct full URLs in the test or via `UrlFactory`.

## Fixtures

`fixtures/auth.fixture.ts` extends Playwright's base test with `authenticatedPage`. A test using this fixture starts already logged in as `standard_user / secret_sauce` (URL confirmed at `inventory.html`). Use the fixture name `authenticatedPage` instead of rolling your own login in the test body.

## Test data

All credentials and payloads live in `test-data/constants.ts`. Tests import from factory classes in `test-data/factories.ts`. Do not embed literal credentials inline in spec files.

## Keeping this file current

When you add a new directory, page object, fixture, utility, factory, or any other significant structure, update this file — especially the **Directory map** section. If purpose or location changes, keep it in sync so agents always have an accurate project map.

## Working environment

| Parameter        | Value              |
| ---------------- | ------------------ |
| Operating System | Windows 11         |
| IDE              | Visual Studio Code |
| IDE Terminal     | PowerShell 7+      |

## Code style

TypeScript strict mode (`strict: true`), `no-floating-promises: error`, `no-explicit-any: warn`.  
Prettier: single quotes, trailing commas, 2-space indent, printWidth 100, semicolons enforced. ESLint's prettier integration is active — run `npm run lint:fix` before committing formatting changes.
