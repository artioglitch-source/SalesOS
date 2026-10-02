create or replace function public.current_user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "org_members_read" on public.organizations
  for select using (id = public.current_user_org_id());

create policy "org_roles_read" on public.roles
  for select using (organization_id = public.current_user_org_id());

create policy "role_members_read" on public.role_members
  for select using (exists (
    select 1 from public.roles r
    where r.id = role_members.role_id
      and r.organization_id = public.current_user_org_id()
  ));

create policy "settings_org_read" on public.settings
  for select using (organization_id = public.current_user_org_id());

create policy "settings_org_write" on public.settings
  for all using (organization_id = public.current_user_org_id())
  with check (organization_id = public.current_user_org_id());

create policy "flags_org_read" on public.feature_flags
  for select using (organization_id = public.current_user_org_id());

create policy "audit_org_read" on public.audit_logs
  for select using (organization_id = public.current_user_org_id());
