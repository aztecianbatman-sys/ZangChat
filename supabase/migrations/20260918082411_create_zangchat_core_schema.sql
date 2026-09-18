create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('mixed','tech','gaming','casual')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  content_type text not null default 'text' check (content_type in ('text','code','lobby','media')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.presence (
  user_id uuid not null references public.profiles(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  x_coordinate double precision not null default 0,
  y_coordinate double precision not null default 0,
  updated_at timestamptz not null default now(),
  primary key (channel_id,user_id)
);

create index if not exists messages_channel_created_idx on public.messages(channel_id,created_at desc);
create index if not exists presence_channel_updated_idx on public.presence(channel_id,updated_at desc);

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.presence enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.channels from anon;
revoke all on table public.messages from anon;
revoke all on table public.presence from anon;
grant select,insert,update on table public.profiles to authenticated;
grant select on table public.channels to authenticated;
grant select,insert on table public.messages to authenticated;
grant select,insert,update,delete on table public.presence to authenticated;

drop policy if exists profiles_select_authenticated on public.profiles;
create policy profiles_select_authenticated on public.profiles for select to authenticated using (true);
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated with check ((select auth.uid())=id);
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);

drop policy if exists channels_select_authenticated on public.channels;
create policy channels_select_authenticated on public.channels for select to authenticated using (true);

drop policy if exists messages_select_authenticated on public.messages;
create policy messages_select_authenticated on public.messages for select to authenticated using (true);
drop policy if exists messages_insert_self on public.messages;
create policy messages_insert_self on public.messages for insert to authenticated with check ((select auth.uid())=user_id);

drop policy if exists presence_select_authenticated on public.presence;
create policy presence_select_authenticated on public.presence for select to authenticated using (true);
drop policy if exists presence_insert_self on public.presence;
create policy presence_insert_self on public.presence for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists presence_update_self on public.presence;
create policy presence_update_self on public.presence for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists presence_delete_self on public.presence;
create policy presence_delete_self on public.presence for delete to authenticated using ((select auth.uid())=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,username,avatar_url,metadata)
  values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'username'),''),'user_'||substr(new.id::text,1,8)),nullif(new.raw_user_meta_data->>'avatar_url',''),coalesce(new.raw_user_meta_data,'{}'::jsonb))
  on conflict(id) do update set username=excluded.username,avatar_url=excluded.avatar_url,metadata=excluded.metadata;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public,anon,authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.channels(id,name,type) values
('11111111-1111-4111-8111-111111111111','General','mixed'),
('22222222-2222-4222-8222-222222222222','Dev Lab','tech'),
('33333333-3333-4333-8333-333333333333','Game Room','gaming'),
('44444444-4444-4444-8444-444444444444','Life','casual')
on conflict(id) do nothing;

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='presence') then
    alter publication supabase_realtime add table public.presence;
  end if;
end $$;