begin;

create extension if not exists pgcrypto;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
as $$
begin
  if to_regclass('public.profiles') is null then
    return false;
  end if;

  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
end;
$$;

-- Helper: create read/write policies safely if tables/columns exist.
do $$
begin
  -- site_settings (public read, admin write)
  if to_regclass('public.site_settings') is not null then
    execute 'alter table public.site_settings enable row level security';
    execute 'drop policy if exists site_settings_public_read on public.site_settings';
    execute 'create policy site_settings_public_read on public.site_settings for select to anon, authenticated using (true)';
    execute 'drop policy if exists site_settings_admin_access on public.site_settings';
    execute 'create policy site_settings_admin_access on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- site_content (public read, admin write)
  if to_regclass('public.site_content') is not null then
    execute 'alter table public.site_content enable row level security';
    execute 'drop policy if exists site_content_public_read on public.site_content';
    execute 'create policy site_content_public_read on public.site_content for select to anon, authenticated using (true)';
    execute 'drop policy if exists site_content_admin_access on public.site_content';
    execute 'create policy site_content_admin_access on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- authors (public read, admin write)
  if to_regclass('public.authors') is not null then
    execute 'alter table public.authors enable row level security';
    execute 'drop policy if exists authors_public_read on public.authors';
    execute 'create policy authors_public_read on public.authors for select to anon, authenticated using (true)';
    execute 'drop policy if exists authors_admin_access on public.authors';
    execute 'create policy authors_admin_access on public.authors for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- categories (public read, admin write)
  if to_regclass('public.categories') is not null then
    execute 'alter table public.categories enable row level security';
    execute 'drop policy if exists categories_public_read on public.categories';
    execute 'create policy categories_public_read on public.categories for select to anon, authenticated using (true)';
    execute 'drop policy if exists categories_admin_access on public.categories';
    execute 'create policy categories_admin_access on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- artworks (public read of active, admin write)
  if to_regclass('public.artworks') is not null then
    execute 'alter table public.artworks enable row level security';
    execute 'drop policy if exists artworks_public_read on public.artworks';

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'artworks'
        and column_name = 'is_active'
    ) then
      execute 'create policy artworks_public_read on public.artworks for select to anon, authenticated using (is_active = true)';
    else
      execute 'create policy artworks_public_read on public.artworks for select to anon, authenticated using (true)';
    end if;

    execute 'drop policy if exists artworks_admin_access on public.artworks';
    execute 'create policy artworks_admin_access on public.artworks for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- posts (public read of published, admin write)
  if to_regclass('public.posts') is not null then
    execute 'alter table public.posts enable row level security';
    execute 'drop policy if exists posts_public_read on public.posts';

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'posts'
        and column_name = 'is_published'
    ) then
      execute 'create policy posts_public_read on public.posts for select to anon, authenticated using (is_published = true)';
    else
      execute 'create policy posts_public_read on public.posts for select to anon, authenticated using (true)';
    end if;

    execute 'drop policy if exists posts_admin_access on public.posts';
    execute 'create policy posts_admin_access on public.posts for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- collections (admin only)
  if to_regclass('public.collections') is not null then
    execute 'alter table public.collections enable row level security';
    execute 'drop policy if exists collections_admin_access on public.collections';
    execute 'create policy collections_admin_access on public.collections for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- messages (public insert, admin read/write)
  if to_regclass('public.messages') is not null then
    execute 'alter table public.messages enable row level security';
    execute 'drop policy if exists messages_public_insert on public.messages';
    execute 'create policy messages_public_insert on public.messages for insert to anon, authenticated with check (true)';
    execute 'drop policy if exists messages_admin_read on public.messages';
    execute 'create policy messages_admin_read on public.messages for select to authenticated using (public.is_admin())';
    execute 'drop policy if exists messages_admin_update on public.messages';
    execute 'create policy messages_admin_update on public.messages for update to authenticated using (public.is_admin()) with check (public.is_admin())';
    execute 'drop policy if exists messages_admin_delete on public.messages';
    execute 'create policy messages_admin_delete on public.messages for delete to authenticated using (public.is_admin())';
  end if;

  -- media_assets (admin only)
  if to_regclass('public.media_assets') is not null then
    execute 'alter table public.media_assets enable row level security';
    execute 'drop policy if exists media_assets_select_authenticated on public.media_assets';
    execute 'drop policy if exists media_assets_insert_authenticated on public.media_assets';
    execute 'drop policy if exists media_assets_update_authenticated on public.media_assets';
    execute 'drop policy if exists media_assets_delete_authenticated on public.media_assets';
    execute 'drop policy if exists media_assets_admin_access on public.media_assets';
    execute 'create policy media_assets_admin_access on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;

  -- analytics_monthly (admin only)
  if to_regclass('public.analytics_monthly') is not null then
    execute 'alter table public.analytics_monthly enable row level security';
    execute 'drop policy if exists analytics_monthly_select_authenticated on public.analytics_monthly';
    execute 'drop policy if exists analytics_monthly_write_authenticated on public.analytics_monthly';
    execute 'drop policy if exists analytics_monthly_admin_access on public.analytics_monthly';
    execute 'create policy analytics_monthly_admin_access on public.analytics_monthly for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  end if;
end;
$$;

notify pgrst, 'reload schema';

commit;
