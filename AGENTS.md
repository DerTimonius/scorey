# AGENTS.md

This file provides instructions and conventions for agentic coding assistants working in this repository. Follow these rules unless explicitly overridden by a user prompt.

---

## Project Overview

- **Name**: Scorey
- **Stack**: React 19, TypeScript, Vite, Tailwind CSS v4
- **State**: Jotai
- **Forms/Validation**: react-hook-form + valibot
- **i18n**: i18next
- **Lint/Format**: Biome
- **E2E Tests**: Playwright
- **Package Manager**: pnpm (required)

---

## Environment Setup

- Node.js: use a modern LTS compatible with Vite 7
- Package manager **must** be `pnpm`
- Install dependencies:
  ```bash
  pnpm install
  ```

---

## Common Commands

### Development

- Start dev server:
  ```bash
  pnpm dev
  ```

- Production build:
  ```bash
  pnpm build
  ```

- Preview production build:
  ```bash
  pnpm preview
  ```

### Type Checking

- Run TypeScript checks only:
  ```bash
  pnpm typecheck
  ```

---

## Linting & Formatting (Biome)

Biome is the **single source of truth** for formatting and linting.

- Format code:
  ```bash
  pnpm format
  ```

- Lint and auto-fix safe rules:
  ```bash
  pnpm lint
  ```

- Lint including unsafe fixes:
  ```bash
  pnpm lint:unsafe
  ```

- Full lint + assist pass (preferred before commits):
  ```bash
  pnpm lint:all
  ```

- Check only (no writes):
  ```bash
  pnpm check
  ```

---

## Testing (Playwright)

### Run All E2E Tests

```bash
pnpm test:e2e
```

### Run a Single Test File

```bash
pnpm test:e2e tests/basic.spec.ts
```

### Run a Single Test by Name

```bash
pnpm test:e2e -g "should create game"
```

### Debug or UI Mode

```bash
pnpm test:e2e:debug
pnpm test:e2e:ui
```

---

## Code Style Guidelines

### Formatting (enforced by Biome)

- Indentation: **2 spaces**
- Quotes: **single quotes**
- Semicolons: **required**
- Trailing commas: **always (ES style)**
- Imports: automatically organized by Biome

Do **not** fight the formatter. Run `pnpm format` instead of manual edits.

---

### Imports

- Order is handled by Biome `organizeImports`
- Use **absolute imports** via Vite aliases when available
- Group imports logically:
  - External libraries
  - Internal modules
  - Relative imports

Do not manually reorder unless Biome fails.

---

### TypeScript

- Prefer `type` over `interface` unless extending
- Avoid `any`; use `unknown` when necessary
- Narrow types early and explicitly
- Use discriminated unions for state-like data
- All React components must be typed

Example:
```ts
type Props = {
  value: number;
  onChange: (value: number) => void;
};
```

---

### React & Components

- Use **function components only**
- Prefer hooks over class-like abstractions
- Keep components small and focused
- Extract reusable UI into `src/components/ui`
- Domain components live under feature folders

Naming:
- Components: `PascalCase`
- Hooks: `useSomething`
- Files: match exported symbol name

---

### State Management (Jotai)

- Keep atoms close to their domain
- Avoid global atoms unless truly shared
- Prefer derived atoms over imperative updates

---

### Styling (Tailwind CSS)

- Tailwind v4 utilities only
- Class order is enforced (`useSortedClasses`)
- Exception: `src/components/ui/**` allows free ordering
- Use `clsx` / `cva` for conditional styles

---

### Error Handling

- No `console.log` / `console.error` (Biome error)
- Fail fast with explicit errors
- Prefer user-facing error states over silent failures
- Validate all external inputs (forms, storage)

---

### i18n

- All user-visible strings must be localized
- Use `useTranslation` hook
- Keys live under `src/locales/{lang}`
- Do not inline user-facing text

---

### Testing Guidelines

- Prefer E2E tests for user-visible behavior
- Tests live in `tests/`
- Use descriptive test names
- Avoid brittle selectors; prefer role/text

---

## Repository Hygiene

- Do not commit generated files
- Do not add new linters or formatters
- Do not change Biome rules without discussion
- Keep PRs focused and minimal

---

## Editor / Agent Notes

- No Cursor or Copilot rule files detected
- This file applies to the entire repository
- User instructions always override this file

---

## Before Finalizing Changes

- `pnpm lint:all`
- `pnpm typecheck`
- Relevant Playwright tests

If unsure, ask before making structural changes.
