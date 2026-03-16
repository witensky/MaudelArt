begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null unique,
  public_url text not null,
  size bigint not null default 0,
  mime_type text,
  credit text,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

alter table public.media_assets enable row level security;

drop policy if exists "media_assets_select_authenticated" on public.media_assets;
create policy "media_assets_select_authenticated"
on public.media_assets
for select
to authenticated
using (true);

drop policy if exists "media_assets_insert_authenticated" on public.media_assets;
create policy "media_assets_insert_authenticated"
on public.media_assets
for insert
to authenticated
with check (true);

drop policy if exists "media_assets_update_authenticated" on public.media_assets;
create policy "media_assets_update_authenticated"
on public.media_assets
for update
to authenticated
using (true)
with check (true);

drop policy if exists "media_assets_delete_authenticated" on public.media_assets;
create policy "media_assets_delete_authenticated"
on public.media_assets
for delete
to authenticated
using (true);

create index if not exists media_assets_created_at_idx on public.media_assets (created_at desc);

create table if not exists public.analytics_monthly (
  id uuid primary key default gen_random_uuid(),
  month text not null unique,
  unique_visits integer not null default 0,
  artwork_views integer not null default 0,
  avg_time_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint analytics_monthly_month_format_check check (month ~ '^[0-9]{4}-[0-9]{2}$')
);

drop trigger if exists analytics_monthly_set_updated_at on public.analytics_monthly;
create trigger analytics_monthly_set_updated_at
before update on public.analytics_monthly
for each row
execute function public.set_updated_at();

alter table public.analytics_monthly enable row level security;

drop policy if exists "analytics_monthly_select_authenticated" on public.analytics_monthly;
create policy "analytics_monthly_select_authenticated"
on public.analytics_monthly
for select
to authenticated
using (true);

drop policy if exists "analytics_monthly_write_authenticated" on public.analytics_monthly;
create policy "analytics_monthly_write_authenticated"
on public.analytics_monthly
for all
to authenticated
using (true)
with check (true);

create index if not exists analytics_monthly_month_idx on public.analytics_monthly (month);

-- Ask PostgREST to refresh schema cache after adding new tables/columns.
notify pgrst, 'reload schema';

commit;
