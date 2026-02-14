-- Realtime broadcast for form response inserts.
-- Emits to a private topic scoped by form owner:
--   form-responses:{owner_id}

create or replace function public.broadcast_form_response_insert()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  form_owner_id uuid;
begin
  select f.owner_id
  into form_owner_id
  from public.forms f
  where f.id = new.form_id;

  if form_owner_id is null then
    return new;
  end if;

  perform realtime.broadcast_changes(
    'form-responses:' || form_owner_id::text,
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    null
  );

  return new;
end;
$$;

drop trigger if exists form_responses_broadcast_insert on public.form_responses;
create trigger form_responses_broadcast_insert
after insert on public.form_responses
for each row
execute function public.broadcast_form_response_insert();

drop policy if exists "realtime_listen_own_form_responses" on realtime.messages;
create policy "realtime_listen_own_form_responses"
on realtime.messages
for select
to authenticated
using (
  realtime.topic() = 'form-responses:' || auth.uid()::text
);
