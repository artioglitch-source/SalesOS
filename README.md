# SalesOS

SalesOS is a modular, multi-tenant sales and operations platform built with Next.js, Supabase, and Vercel.

## Phase 0

Foundation only: authentication, organization identity, roles/RLS scaffolding, Arabic/English i18n with RTL, application shell, command palette, module registry, feature flags, settings, audit-log foundation, tests, and CI.

## Repository layout

- `apps/web` — Next.js application
- `modules` — independently removable business modules
- `supabase` — migrations, functions, and seed data
- `docs` — architecture and operations documentation

## Requirements

- Node.js 22 LTS
- pnpm 10+

## Local development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and provide the Supabase project values when the Supabase project is connected.
