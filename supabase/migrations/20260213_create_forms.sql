-- Forms table for dynamic form builder drafts/published forms.
-- Execute in Supabase SQL Editor or via Supabase CLI migration flow.

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Formulario sin titulo',
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published','archived')),
  schema jsonb not null default '{"version":1,"fields":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forms_owner_id_idx on public.forms(owner_id);
create index if not exists forms_owner_updated_idx on public.forms(owner_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists forms_set_updated_at on public.forms;
create trigger forms_set_updated_at
before update on public.forms
for each row
execute function public.set_updated_at();

alter table public.forms enable row level security;

drop policy if exists "forms_select_own" on public.forms;
create policy "forms_select_own"
on public.forms
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "forms_insert_own" on public.forms;
create policy "forms_insert_own"
on public.forms
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "forms_update_own" on public.forms;
create policy "forms_update_own"
on public.forms
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "forms_delete_own" on public.forms;
create policy "forms_delete_own"
on public.forms
for delete
to authenticated
using (owner_id = auth.uid());
