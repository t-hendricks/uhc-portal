# OCM UI (uhc-portal)

UI for OpenShift Cluster Manager — a React/TypeScript single-page application running on console.redhat.com under the `/openshift` route. Built on PatternFly (design system and component library), React Query (server state). Jest handles unit testing and  Playwright handles E2E against staging.

Some parts of the application are legacy code, using JavaScript and Redux for global state management and data fetching.

## Documents index

All documents are located inside `/docs`. Read the relevant file before writing or reviewing code.

```text
root: docs/

UI-components:              code-guide.md
contributing:               contributing.md
unit-testing:               unit-testing.md
e2e-testing:                Playwright-e2e-test-automation-guidelines.md
e2e-testing FAQ:            Playwright-e2e-test-automation-faq.md
```

For information about the generation of TS models from OpenAPI specs, check the `/openapi/README.md` doc.

## Project structure

```text
src/
  bootstrap.ts          # App entry point
  chrome-main.tsx       # Module federation root
  common/               # Shared utilities, UI components, and link definitions (docLinks, supportLinks, installLinks)
  components/           # Feature components organized by domain
  config/               # Environment and app configuration
  hoc/                  # Higher-order components
  hooks/                # Shared custom hooks
  queries/              # TanStack Query hooks organized by feature/domain
  redux/                # Legacy Redux store, reducers, actions
  services/             # API request layer and service functions
  styles/               # Global styles
  types/                # OpenAPI-generated TypeScript types
```

Other relevant top-level directories:

```text
docs/           # Project documentation and coding guidelines
openapi/        # OpenAPI specs and type generation
playwright/     # Playwright E2E tests
cypress/        # Cypress E2E tests (legacy)
.storybook/     # Storybook configuration
mockdata/       # Mock API data for local development
__mocks__/      # Jest module mocks
```

## PR and Commit Conventions

When opening a pull request, follow the PR template in [`.github/pull_request_template.md`](.github/pull_request_template.md).

## PR Reviews

When reviewing a pull request, follow the process in [`docs/pull-request-process.md`](docs/pull-request-process.md) and verify the code adheres to [`docs/code-guide.md`](docs/code-guide.md) and [`docs/unit-testing.md`](docs/unit-testing.md).

## Code review rules

When reviewing or writing code in `src/`, enforce these rules:

- Do not use inline `style` props on PatternFly components. Use PatternFly utility classes or layout components (`Stack`, `Flex`, `Grid`, etc.) instead.
- Boolean props must be prefixed with `is`, `has`, `can`, or `should`. Names like `highlight`, `active`, or `enabled` are not allowed.
- Do not use `useMemo` for values that are not computationally expensive, including passing through `children` unchanged.
- Avoid `lodash/get`. Use optional chaining (`?.`) and nullish coalescing (`??`) instead.
- Do not add `console.log` to application code.
- Do not use `useEffect` to sync a prop into local `useState` when the value can be derived during render.

