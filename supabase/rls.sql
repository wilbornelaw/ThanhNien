alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.site_settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "profiles are readable publicly" on public.profiles;
create policy "profiles are readable publicly"
on public.profiles
for select
using (true);

drop policy if exists "staff can manage profiles" on public.profiles;
create policy "staff can manage profiles"
on public.profiles
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "categories are readable publicly" on public.categories;
create policy "categories are readable publicly"
on public.categories
for select
using (true);

drop policy if exists "staff can manage categories" on public.categories;
create policy "staff can manage categories"
on public.categories
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "tags are readable publicly" on public.tags;
create policy "tags are readable publicly"
on public.tags
for select
using (true);

drop policy if exists "staff can manage tags" on public.tags;
create policy "staff can manage tags"
on public.tags
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "published posts are readable publicly" on public.posts;
create policy "published posts are readable publicly"
on public.posts
for select
using (
  (
    status = 'published'
    or status = 'scheduled'
  )
  and published_at is not null
  and published_at <= timezone('utc', now())
);

drop policy if exists "staff can manage posts" on public.posts;
create policy "staff can manage posts"
on public.posts
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "post tags are readable when post is public" on public.post_tags;
create policy "post tags are readable when post is public"
on public.post_tags
for select
using (
  exists (
    select 1
    from public.posts
    where posts.id = post_tags.post_id
      and (
        posts.status = 'published'
        or posts.status = 'scheduled'
      )
      and posts.published_at is not null
      and posts.published_at <= timezone('utc', now())
  )
);

drop policy if exists "staff can manage post tags" on public.post_tags;
create policy "staff can manage post tags"
on public.post_tags
for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "site settings are readable publicly" on public.site_settings;
create policy "site settings are readable publicly"
on public.site_settings
for select
using (true);

drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "admins can manage site settings"
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "newsletter insert is public" on public.newsletter_subscribers;
create policy "newsletter insert is public"
on public.newsletter_subscribers
for insert
with check (true);

drop policy if exists "admins can read newsletter subscribers" on public.newsletter_subscribers;
create policy "admins can read newsletter subscribers"
on public.newsletter_subscribers
for select
using (public.is_admin());

drop policy if exists "public can read storage media" on storage.objects;
create policy "public can read storage media"
on storage.objects
for select
using (bucket_id = 'news-media');

drop policy if exists "staff can upload storage media" on storage.objects;
create policy "staff can upload storage media"
on storage.objects
for insert
with check (
  bucket_id = 'news-media'
  and public.is_staff()
);

drop policy if exists "staff can update storage media" on storage.objects;
create policy "staff can update storage media"
on storage.objects
for update
using (
  bucket_id = 'news-media'
  and public.is_staff()
)
with check (
  bucket_id = 'news-media'
  and public.is_staff()
);

drop policy if exists "staff can delete storage media" on storage.objects;
create policy "staff can delete storage media"
on storage.objects
for delete
using (
  bucket_id = 'news-media'
  and public.is_staff()
);

