create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.role_members (
  role_id uuid not null references public.roles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (role_id, user_id)
);

alter table public.roles enable row level security;
alter table public.role_members enable row level security;
