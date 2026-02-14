-- Responses table for published forms.
-- Stores dynamic answers as jsonb to match dynamic form schema.

create table if not exists public.form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  ip inet,
  user_agent text
);

create index if not exists form_responses_form_id_idx on public.form_responses(form_id);
create index if not exists form_responses_form_submitted_idx on public.form_responses(form_id, submitted_at desc);
create index if not exists form_responses_answers_gin_idx on public.form_responses using gin (answers);

alter table public.form_responses enable row level security;

drop policy if exists "responses_insert_published_forms" on public.form_responses;
create policy "responses_insert_published_forms"
on public.form_responses
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.forms f
    where f.id = form_id
      and f.status = 'published'
  )
);

drop policy if exists "responses_select_owner" on public.form_responses;
create policy "responses_select_owner"
on public.form_responses
for select
to authenticated
using (
  exists (
    select 1
    from public.forms f
    where f.id = form_id
      and f.owner_id = auth.uid()
  )
);

