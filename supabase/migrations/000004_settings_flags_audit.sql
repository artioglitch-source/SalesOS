create table if not exists public.settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  values jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (organization_id, key)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.settings enable row level security;
alter table public.feature_flags enable row level security;
alter table public.audit_logs enable row level security;
