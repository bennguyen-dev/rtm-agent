# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**.

- `pnpm dev` — start Next.js dev server (http://localhost:3000)
- `pnpm build` — production build
- `pnpm start` — run built app
- `pnpm lint` — Biome check (lint + format check)
- `pnpm format` — Biome format --write
- `npx tsc --noEmit` — type-check only (no test framework is configured)

The dev server requires `GEMINI_API_KEY` in `.env.local` — the API route returns 500 without it.

## Architecture

Single-purpose Next.js 16 (App Router) + React 19 + Tailwind v4 app that converts feature-ticket text into a Requirements Traceability Matrix (RTM) of test cases via Google Gemini. This is a port of an n8n workflow ("Automation RTM") into a web app; see `rtm-generator.md` and `Automation RTM.json` for the original spec.

Data flow:

1. `src/app/page.tsx` (client component) holds the `results` state and renders `RtmForm` / `RtmPreview` / `DownloadButtons`.
2. `RtmForm` POSTs `{ requirements, language }` to `/api/generate`.
3. `src/app/api/generate/route.ts` validates input, then calls `generateTestCases` from `src/lib/gemini.ts`. When `language === "both"`, English and Vietnamese are generated in parallel via `Promise.all`.
4. `src/lib/gemini.ts` builds a language-specific prompt (`buildEnglishPrompt` / `buildVietnamesePrompt`, ported 1:1 from the n8n workflow), calls `gemini-flash-latest` with a `ResponseSchema` enforcing `{ test_cases: TestCase[] }` JSON-mode output, and wraps the call in `callWithRetry` (exponential backoff up to 60s, only retries on errors containing `"429"`).
5. `RtmPreview` groups test cases by their `Group` field and renders the HTML inside `Action` / `Input` / `Expected_result` via `dangerouslySetInnerHTML` — the prompt explicitly instructs Gemini to format these fields with `<p>`, `<ol>`, `<li>`, `<strong>`.
6. `DownloadButtons` produces CSV / HTML files client-side via `Blob` — nothing is persisted server-side.

Key invariants:

- The shared `TestCase` shape (`Action`, `Input`, `Expected_result`, `Group`) is declared in `src/lib/types.ts` and mirrored in the Gemini `responseSchema`. Changing one requires changing all three (type, schema, prompt instructions) and the CSV/HTML/preview renderers.
- The API key is only read server-side (`process.env.GEMINI_API_KEY` in the Route Handler / `lib/gemini.ts`); never expose it to a client component.
- Path alias `@/*` → `./src/*`.
- `next.config.ts` enables `reactCompiler: true` (babel-plugin-react-compiler) — avoid hand-written `useMemo` / `useCallback` unless profiling shows the compiler can't handle a case.

## Tooling notes

- **Biome 2** is the only linter/formatter (no ESLint/Prettier). Config in `biome.json` enables the `next` and `react` rule domains; `suspicious/noUnknownAtRules` is off for Tailwind v4's `@theme` / `@apply`.
- **Tailwind v4** via `@tailwindcss/postcss` — design tokens live in `src/app/globals.css` (no `tailwind.config.js`).
- `sonner` is used for toasts; `lucide-react` for icons.
