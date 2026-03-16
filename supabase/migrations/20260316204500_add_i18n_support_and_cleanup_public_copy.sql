begin;

alter table if exists public.site_settings
  add column if not exists default_language text not null default 'fr';

alter table if exists public.site_settings
  add column if not exists supported_languages jsonb not null default '["fr","en"]'::jsonb;

update public.site_settings
set
  default_language = 'fr',
  supported_languages = '["fr","en"]'::jsonb
where true;

alter table if exists public.authors
  add column if not exists bio_en text;

update public.authors
set bio_en = coalesce(nullif(bio_en, ''), bio)
where coalesce(bio, '') <> '';

alter table if exists public.artworks
  add column if not exists title_en text;

alter table if exists public.artworks
  add column if not exists description_en text;

alter table if exists public.artworks
  add column if not exists technique_en text;

update public.artworks
set
  title_en = coalesce(nullif(title_en, ''), title),
  description_en = coalesce(nullif(description_en, ''), description),
  technique_en = coalesce(nullif(technique_en, ''), technique);

alter table if exists public.posts
  add column if not exists title_en text;

alter table if exists public.posts
  add column if not exists excerpt_en text;

alter table if exists public.posts
  add column if not exists content_en text;

update public.posts
set
  title_en = coalesce(nullif(title_en, ''), title),
  excerpt_en = coalesce(nullif(excerpt_en, ''), excerpt),
  content_en = coalesce(nullif(content_en, ''), content);

alter table if exists public.categories
  add column if not exists name_en text;

update public.categories
set name_en = case name
  when 'Nature' then 'Nature'
  when 'Paysages marins' then 'Seascapes'
  when 'Portraits' then 'Portraits'
  when 'Natures mortes' then 'Still lifes'
  else coalesce(nullif(name_en, ''), name)
end;

update public.site_content
set content = coalesce(content, '{}'::jsonb)
  || jsonb_build_object(
    'hero_cta', 'Explorer la galerie',
    'gallery_title', 'Galerie',
    'gallery_description', 'Selection meticuleuse d''oeuvres originales, serenite et elegance tropicale.',
    'contact_title', 'Entrer dans l''univers',
    'contact_subtitle', 'Collaboration & Acquisition',
    'footer_slogan', 'La beaute sauvera le monde.',
    'about_quote', 'L''art ne reproduit pas le visible ; il rend visible.',
    'about_quote_author', 'Paul Klee'
  )
where key = 'global_texts';

insert into public.site_content (key, type, content)
select
  'global_texts',
  'json',
  jsonb_build_object(
    'hero_cta', 'Explorer la galerie',
    'gallery_title', 'Galerie',
    'gallery_description', 'Selection meticuleuse d''oeuvres originales, serenite et elegance tropicale.',
    'contact_title', 'Entrer dans l''univers',
    'contact_subtitle', 'Collaboration & Acquisition',
    'footer_slogan', 'La beaute sauvera le monde.',
    'about_quote', 'L''art ne reproduit pas le visible ; il rend visible.',
    'about_quote_author', 'Paul Klee'
  )
where not exists (
  select 1
  from public.site_content
  where key = 'global_texts'
);

commit;
