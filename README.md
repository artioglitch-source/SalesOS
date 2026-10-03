# SalesOS

SalesOS is a modular, multi-tenant sales and operations platform built with Next.js, Supabase, and Vercel.

## Stack

- Next.js 16.3.6 + React 19
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS + Edge Functions + pg_cron
- Vercel AI SDK-compatible provider layer with a zero-cost deterministic local provider
- Recharts
- PWA + IndexedDB offline activity queue

## Free deployment

SalesOS is designed to run on free tiers without paid services:

- GitHub repository: this repository
- Vercel: Hobby project
- Supabase: Free project
- No paid AI provider is required for the default assistant

### Vercel

Import this repository from GitHub.

Use:

- Framework: Next.js
- Root Directory: `apps/web`
- Install Command: default pnpm detection
- Build Command: `pnpm build`

Set these environment variables in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=https://wcdghigostqarglvobam.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>
```

The exact `*.vercel.app` hostname is assigned by Vercel. A specific short hostname such as `sms.vercel.app` cannot be assumed to be available.

### Supabase Auth redirect

After the Vercel deployment has a URL, add:

```text
https://<your-vercel-domain>/<ar|en>/auth/callback
```

to the Supabase Auth redirect URLs.

### Local

Requirements: Node.js 22 LTS and pnpm 10.

```bash
pnpm install
pnpm dev
```

## Repository layout

- `apps/web` — Next.js application
- `modules` — module manifests/catalog
- `supabase` — database and Edge Function source
- `docs` — architecture, deployment, runbook and extension notes

## Current foundation

The repository contains authentication/onboarding, organization roles, RLS, CRM entities, sales/invoices, collections/aging, customer 360, targets, KPI templates, rep performance, commission calculation, payroll configuration, reports, alerts, CSV/XLSX import, PWA/offline activity capture, extensions/custom fields, audit logs, and the local data-grounded assistant.
