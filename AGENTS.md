# CareerForge Frontend — Agent Instructions

## Implementation Principle
This project is developed incrementally. Before implementing a new feature, inspect the existing repository, existing components, route structure, API contracts, schemas, and UI. Never invent backend endpoints or duplicate existing components. Implement features in small validated steps and run `npm run build` after each major step.

## Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS
- shadcn/ui for base components
- Redux Toolkit + RTK Query (RTK Query owns all server/API state; Redux slices are ONLY for global client state like auth — never cache API responses in a slice)
- React Hook Form + Zod for all forms and validation
- lucide-react for icons
- recharts for charts

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npx shadcn@latest add <component>` — add a new shadcn component

## Backend
- Backend is a separate NestJS repo, not part of this codebase.
- API base URL comes from `NEXT_PUBLIC_API_URL` in `.env.local`.
- Response shape from API is always `{ success, data, meta, error }` — type every RTK Query endpoint against a shared `ApiResponse<T>` type in `src/lib/types`.

## Project structure
- Route groups: `(marketing)`, `(auth)`, `(dashboard)` under `src/app`
- Feature components under `src/components/<feature>` (dashboard, compatibility, learning, assessments, jobs, forms, charts)
- Base/shared UI primitives under `src/components/ui` (shadcn-managed — don't hand-edit unless customizing intentionally)
- RTK Query API slices under `src/lib/redux/api/`, one file per domain (`authApi.ts`, `jobsApi.ts`, etc.)
- Redux slices (client state only) under `src/lib/redux/slices/`
- Zod schemas under `src/lib/schemas/`, mirroring backend DTOs exactly
- Shared hooks under `src/lib/hooks/`

## Component reuse — MANDATORY
- Before creating any new component, search `src/components/ui` and `src/components/<feature>` for an existing one that already does this or something close to it.
- If a similar component exists, extend or reuse it (via props) instead of creating a near-duplicate.
- If a new component will plausibly be needed in more than one place (buttons, cards, form fields, badges, empty states, loading states, modals), build it as a shared component from the start — don't inline it in a page and refactor later.
- Shared/reusable components go in `src/components/ui` (generic, no feature knowledge) or `src/components/shared` (cross-feature but app-specific, e.g. `PageHeader`, `EmptyState`, `StatCard`).
- Never copy-paste a component's JSX to create a variant — parameterize the original with props instead.

## Shared styling — MANDATORY
- Any Tailwind class combination repeated 3+ times across files must be extracted:
  - As a reusable component (preferred, if it wraps markup), OR
  - As a `@layer components` utility class in `src/app/globals.css` (if it's pure styling with no markup structure, e.g. `.card-surface`, `.section-heading`, `.form-error-text`).
- Never redefine the same color, spacing, radius, or shadow combination ad hoc in multiple files — use Tailwind theme tokens (`src/app/globals.css` `@theme`/CSS variables) or shadcn's existing design tokens.
- Before adding a new custom class to `globals.css`, check it doesn't already exist.

## Code quality — MANDATORY for every change
- **Clean**: no dead code, no commented-out blocks left behind, no unused imports/variables, descriptive names over comments explaining what code does (comments explain *why*, not *what*).
- **Reusable**: extract repeated logic into hooks (`src/lib/hooks`) or utils (`src/lib/utils`) rather than duplicating it across components.
- **Modular**: one component = one responsibility. Split a component if it's handling more than one concern (e.g. data fetching + form logic + layout all in one file — separate these).
- **Scalable**: write code assuming more features/routes/components will be added later — avoid hardcoded values that should be props, config, or constants; avoid tightly coupling components to a specific page when they could be generic.
- Type everything — no `any` unless truly unavoidable, and never leave an implicit `any`.
- Every form uses React Hook Form + a Zod schema — no manual `useState`-based form handling.

## Windows / PowerShell
- This project is developed on Windows. Use `New-Item -ItemType Directory -Force -Path "..."` instead of `mkdir -p`, especially for paths containing parentheses (route groups like `(auth)`, `(dashboard)`).
- Use `@'...'@ | Out-File -FilePath "..." -Encoding utf8` instead of `cat > file << 'EOF'` heredocs — bash heredocs don't work in PowerShell and fail silently or with confusing errors.