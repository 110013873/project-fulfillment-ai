# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An information industry association data management platform (北京信创工委会数据管理平台) — a Chinese-language enterprise data cockpit with dashboards, enterprise database, tender tracking, policy matching, risk monitoring, and member management. Currently uses mock data throughout (no real API).

**Tech Stack:** TanStack Start (SSR React), Cloudflare Workers, shadcn/ui (New York style), Tailwind CSS v4, Recharts, Leaflet, Zod + react-hook-form.

## Commands

```bash
npm run dev          # Start dev server with Vite
npm run build        # Production build (vite build)
npm run build:dev    # Development-mode build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run format       # Prettier
```

No test suite exists yet. The app is purely frontend with mock data.

## Architecture

### Routing (TanStack Start file-based)

- `src/routeTree.gen.ts` — **auto-generated**, never edit manually.
- `src/router.tsx` — creates the Router with `QueryClient` in context and scroll restoration.
- `src/routes/` — file-based routes. `__root.tsx` is the root route defining `<html>`, `<head>`, `<body>`, meta tags, and error/not-found components.
- Nested routing pattern: `enterprises.tsx` renders the list with `<Outlet />` when a child route is active (e.g., `/enterprises/$id` renders `enterprises.$id.tsx` inside it).

### SSR & Deployment

- `src/start.ts` — creates the TanStack Start instance with an error-catching server middleware.
- `src/server.ts` — the Cloudflare Worker entry point (`wrangler.jsonc` → `main`). Wraps the SSR handler with error normalization (h3 silently swallows some SSR throws into generic 500 responses; this file detects and recovers them).
- `src/lib/error-capture.ts` — out-of-band error capture via `error`/`unhandledrejection` events with a 5-second TTL.
- `src/lib/error-page.ts` — renders a standalone HTML error page for server-side failures.
- `vite.config.ts` — uses `@lovable.dev/vite-tanstack-config` which bundles TanStack Start, React, Tailwind, tsconfig-paths, and Cloudflare plugins. Do NOT manually add these plugins.

### Layout

- `src/components/layout/AppShell.tsx` — sidebar + header + main content layout. Also exports `PageHeader` (title, subtitle, action buttons).
- `src/components/layout/AppSidebar.tsx` — five nav groups (驾驶舱, 数据管理, 协会运营, 决策支持, 系统管理) with Lucide icons and active-state highlighting via `useLocation().pathname`.
- `src/components/layout/AppHeader.tsx` — sticky header with breadcrumb-like title derived from current path, search bar (non-functional), notification bell, and user dropdown menu.

### UI Components

All `src/components/ui/*.tsx` are shadcn/ui components (Radix primitives + Tailwind styling, New York variant). `components.json` defines the configuration for `shadcn/ui` CLI. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes with `clsx` + `tailwind-merge`.

### Mock Data (`src/lib/mock-data.ts`)

Central mock data file defining types (`Enterprise`, `Tender`, `Activity`, `Policy`, `Report`, `CrawlerTask`, `SystemUser`, `AuditLog`, etc.) and generating 40 enterprises with seed-based randomness (seed 42). All routes import data directly from this file. Aggregated stats are pre-computed.

### Styling (`src/styles.css`)

Tailwind CSS v4 with CSS-first configuration using `@theme inline` blocks and `@layer` utilities. Defines Oklch color tokens for light/dark modes, custom gradients, shadows, keyframe animations (scan line, marquee, pulse), and cockpit-specific glassmorphism effects. The cockpit route uses a dark sci-fi theme; the rest of the app uses a clean enterprise blue palette.

## Key Patterns

- **Route components**: Each route file exports `const Route = createFileRoute("/path")({ component: PageComponent })`.
- **Route params**: Use `Route.useParams()` for dynamic segments like `$id`.
- **Navigation**: `Link` from `@tanstack/react-router` for declarative; `useNavigate()` for imperative.
- **Toasts**: Import `toast` from `sonner` (`toast.success()`, `toast.error()`).
- **Form validation**: Zod schemas + `react-hook-form` (though most forms currently use manual state).
- **Icons**: Import from `lucide-react` (never from `lucide-react/dist` or sub-paths).

## File Structure

```
src/
├── start.ts              # TanStack Start instance
├── server.ts             # Cloudflare Worker entry
├── router.tsx            # Router + QueryClient creation
├── routeTree.gen.ts      # Auto-generated route tree
├── styles.css            # Global styles + Tailwind config
├── lib/
│   ├── utils.ts          # cn() helper
│   ├── mock-data.ts      # All mock data + types
│   ├── error-capture.ts  # SSR error capture
│   └── error-page.ts     # SSR error page template
├── components/
│   ├── layout/           # AppShell, AppSidebar, AppHeader
│   ├── ui/               # shadcn/ui components
│   └── StatCard.tsx      # KPI stat card with link support
├── routes/               # File-based routes (18 routes)
└── hooks/                # Shared hooks (use-mobile.tsx)
```
