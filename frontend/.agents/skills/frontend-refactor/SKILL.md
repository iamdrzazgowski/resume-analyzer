---
name: frontend-refactor
description:
    Expert Next.js refactoring assistant, calibrated to the resume-analyzer
    frontend (App Router, TanStack Query, Zustand, react-hook-form, shadcn/ui,
    Tailwind v4). Use whenever asked to refactor, clean up, split, restructure,
    deduplicate, or improve code quality anywhere in this frontend — extracting
    hooks/components, simplifying forms, converting to Server Components, or
    aligning new code with existing conventions. Trigger this whenever the user
    mentions refactoring, code review, "clean this up", or file structure in
    this repo, even if they don't say "refactor" explicitly.
---

# Goal

Refactor existing code in this Next.js frontend without changing business logic
or external behavior, unless a change is explicitly requested.

## Principles

- Preserve behavior unless explicitly requested otherwise.
- Improve readability; reduce duplication (DRY); follow SOLID where it actually
  fits a React codebase (mostly: single-responsibility components/hooks).
- Keep components small and focused; avoid premature abstraction — don't extract
  a hook or util for something used once.
- Prefer composition over inheritance (inheritance essentially never applies
  here — this is a note for API/service-layer code, not components).
- Remove dead code and unnecessary comments; use meaningful names.
- **Exception to all of the above**: `src/components/ui/*` is vendored shadcn
  output. Treat it as generated code — don't apply general
  cleanup/renaming/restyling there unless the task specifically targets a shadcn
  primitive.

---

# This codebase: stack & conventions

- Next.js 16 (App Router) + React 19, TypeScript
- Data fetching: TanStack Query (`useMutation`) + `axios`
- Client state: Zustand (`persist` middleware)
- Forms: `react-hook-form` (uncontrolled `register`, manual
  `setValue`/`setError` for non-input fields like files)
- UI: shadcn/ui primitives (`radix-ui` + `class-variance-authority`) in
  `src/components/ui/`
- Styling: Tailwind v4, CSS variables in `src/app/globals.css`
- Package manager: bun (`bun.lock`)

## Two coding styles coexist — don't merge them

- **`src/components/ui/*`**: double quotes, 2-space indent, shadcn-CLI style.
  Never hand-reformat.
- **Everything else** (`app/`, `components/*.tsx` outside `ui/`, `hooks/`,
  `lib/`, `store/`): single quotes, 4-space indent, trailing semicolons,
  `'use client'` only where actually needed. Match this for any refactor in
  these folders.

## Path aliases (from `components.json` / `tsconfig`)

Always use aliases, never relative `../../..` imports: `@/components`,
`@/components/ui`, `@/hooks`, `@/lib`, `@/lib/types`, `@/lib/validators`,
`@/store`.

---

# Established patterns — follow, don't reinvent

**Data mutation hook pattern** (`src/hooks/useAnalyzeMutation.ts`): one hook per
mutation, named `use<Verb><Noun>Mutation`. The hook owns the `axios` call, wires
`onMutate`/`onSuccess`/`onError` to Zustand setters, and returns only what the
component needs. Never call `axios` or `useMutation` directly inside a
component.

**Zustand store pattern** (`src/store/analysisStore.ts`): one store per domain
concept, wrapped in `persist({ name: '<kebab-case>-store' })`, with a `clear()`
action. Select single slices with `useXStore((s) => s.field)`, never destructure
the whole store.

**Form pattern** (`src/components/file-upload-form.tsx`): `react-hook-form` with
plain `register`; virtual fields (files, custom widgets) driven via
`setValue`/`setError`/`clearErrors`. Non-trivial validation lives in
`src/lib/validators/` as pure `(...) => true | string` functions, not inline.

**Types**: shared shapes in `src/lib/types/index.ts`, or colocated in the owning
store file (e.g. `AnalysisResult` lives in `analysisStore.ts`). Local prop types
can stay inline in the component.

**Styling**:

- Repeated Tailwind utility clusters become a `SCREAMING_SNAKE_CASE` constant at
  the top of the file (see `FIELD_LABEL`), not a new CSS class, unless variants
  are needed (then use `cva`).
- Design tokens via Tailwind v4 arbitrary-var syntax: `bg-(--brass)`,
  `text-(--brass-soft)`, `border-(--brass-dim)`. Check `globals.css` before
  inventing a new color.
- `cn()` from `@/lib/utils` (clsx + tailwind-merge) is the only accepted way to
  conditionally combine classes.
- Inline `style={{ animationDelay: ... }}` is the one accepted inline style
  (staggered reveal animations). Nothing else gets inline styles.

---

# General Next.js / React / TypeScript rules

## App Router

- Prefer Server Components; this codebase already does — `page.tsx`,
  `layout.tsx`, and most section components (`hero-section`, `features-section`,
  `method-section`, `stats-strip`, `site-header`, `site-footer`, `score-bar`,
  `analyze-section`) have **no** `'use client'`. Only `providers.tsx`,
  `file-upload-form.tsx`, `scan-visual.tsx`, and `app/results/[id]/page.tsx` are
  client components — each because they genuinely need hooks/state/browser APIs
  (context provider, RHF + drag-and-drop, canvas/animation, Zustand store read).
- When adding new sections, default to a Server Component; only add
  `'use client'` when you actually use hooks, event handlers, or browser-only
  APIs.
- `app/results/[id]/page.tsx` reads from the Zustand store client-side to render
  results — if refactoring this page, consider whether the parts that don't need
  the store (layout, static labels) can be pulled into a Server Component
  wrapper around a smaller client component that only handles the store read.
  Don't do this speculatively — only when actually refactoring that file.
- Move data fetching to Server Components where possible; the current API call
  (`useAnalyzeMutation`) is a client mutation triggered by user action (file
  upload), which is correctly client-side — this isn't something to "fix".

## Components

- Split components larger than ~150 lines. `file-upload-form.tsx` (230 lines) is
  the current offender — see "Known refactor targets" below.
- Extract, when actually duplicated or oversized (not preemptively): UI
  subcomponents, hooks, utility functions, constants, types.
- Avoid prop drilling — reach for the existing Zustand store or a hook instead
  of threading props through 3+ levels.

## TypeScript

- No `any`; prefer `unknown` at boundaries (e.g. `catch` blocks, untyped API
  responses) and narrow explicitly.
- Infer types when possible instead of re-annotating what TS already knows.
- Extract reusable interfaces into `src/lib/types/` per the existing convention.
- Use discriminated unions for state shapes with multiple variants (e.g.
  loading/error/success) instead of multiple optional booleans.
- Use enums sparingly — prefer string literal unions, consistent with the rest
  of the codebase (no enums currently present).

## React

- Avoid: nested ternaries, large `useEffect` blocks, derived state stored
  redundantly, duplicate state (e.g. don't mirror RHF's `watch()` value into a
  `useState` — the codebase already avoids this correctly).
- Prefer: `useMemo`/`useCallback` only when there's a real cost to avoid (the
  codebase already uses `useCallback` for `applyFile` since it's a dependency of
  drag/drop handlers — keep that pattern, don't add memoization elsewhere
  without a reason), custom hooks for reusable stateful logic, early returns
  over nested conditionals, declarative rendering over imperative DOM
  manipulation (the `document.querySelector` in `removeFile` is the one
  exception to fix — see below).

## Imports

- Remove unused imports; sort logically (external packages, then `@/` aliases,
  then relative); use aliases per above; avoid circular dependencies between
  `store/`, `hooks/`, and `components/`.

## Performance

When refactoring, check for: unnecessary re-renders (whole-store destructuring
instead of selectors), duplicated fetches (should be deduped by TanStack Query's
`mutationKey`/`queryKey`, but check custom `useEffect`-based fetches don't
bypass this), large client bundles (watch what gets pulled into the four client
components), missing `Suspense` boundaries around anything that could be async
in the future, unnecessary hydration (client components that don't need to be).

## API

There's currently no route handler layer in this frontend (the FastAPI backend
lives elsewhere) — but if one is added: keep business logic out of the route
handler itself, validate inputs, handle errors consistently, return typed
responses. Follow the same `lib/`-for-pure-logic convention used elsewhere.

---

# Known refactor targets in this codebase

- **`file-upload-form.tsx` (230 lines)**: mixes drag-and-drop state, RHF wiring,
  and two large JSX blocks. Extract a `useFileDropzone` hook (drag handlers +
  `isDragging` + `applyFile`) into `src/hooks/`, and split "uploaded" vs "empty"
  dropzone states into small presentational subcomponents. Keep the RHF field
  name (`file`) and validation messages identical.
- `removeFile`'s `document.querySelector('input[type="file"]')` is the one real
  imperative-DOM smell in the app — replace with a `useRef<HTMLInputElement>` if
  touching this file.
- `scan-visual.tsx` and `hero-section.tsx` repeat magic-number animation delays
  (80/180/300/360/420/520ms) — centralize into a delay-ladder constant if
  refactoring animation timing.

---

# Refactoring process & output format

For every file you refactor:

1. **Explain problems** — what's wrong or could be better, referencing the
   specific conventions above (not generic advice) where relevant.
2. **Explain improvements** — what you'll change and why, in terms of this
   codebase's own patterns.
3. **Produce the complete refactored file** — not a diff/snippet, the full file,
   so it can be pasted in directly.
4. **Explain why the new version is better** — tie back to
   readability/duplication/performance/type-safety as appropriate.

Use this structure in your response:

````
## Problems
...
## Improvements
...
## Refactored Code
​```tsx
...
​```
## Explanation
...
````

Never change external behavior (props, RHF field names, Zustand action names,
API request/response shape) unless the user explicitly asked for that.

## Code quality checklist

Readable · maintainable · typed · modular · matches existing folder taxonomy
(`app/`, `components/`, `components/ui/`, `hooks/`, `lib/`, `store/` — don't
introduce `features/` or `services/` folders that don't already exist here,
since this repo doesn't use them) · performant · production ready.

## Final verification

There's no test suite in this repo — after refactoring, the bar is:

```
bun run lint
bun run build
```

Both must pass. Don't touch `src/components/ui/*` unless the task specifically
targets a shadcn primitive, and don't add `'use client'` to a file that doesn't
need it.
