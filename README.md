# Thanh Nien Newspaper

## 1. Project Architecture Overview

Thanh Nien Newspaper is a Next.js App Router application with two product surfaces:

- Public site under `/` for readers, category discovery, search, article detail pages, SEO metadata, sitemap generation, and newsletter capture.
- Protected admin surface under `/admin` for staff login, dashboard analytics, article publishing, taxonomy management, media uploads, and site settings.

Core architecture decisions:

- Server components are used for public data-heavy pages and admin page loading.
- Client components are used for interactive forms, Supabase auth, TipTap editing, image uploads, theme switching, and lightweight client-side tracking.
- Supabase provides Auth, PostgreSQL tables, and Storage. RLS policies enforce public-read and staff-write behavior.
- Server actions handle post, taxonomy, and settings mutations.
- SEO is implemented through `generateMetadata`, `sitemap.ts`, `robots.ts`, and canonical/Open Graph helpers.

## 2. Folder Structure

```text
app/
  (site)/
    about/
    category/[slug]/
    contact/
    news/[slug]/
    search/
    tag/[slug]/
    layout.tsx
    page.tsx
  admin/
    categories/
    login/
    media/
    posts/
      new/
      [id]/edit/
      [id]/preview/
    settings/
    tags/
    layout.tsx
    page.tsx
  api/
    newsletter/
    views/
  globals.css
  layout.tsx
  not-found.tsx
  robots.ts
  sitemap.ts
components/
  admin/
  editor/
  forms/
  site/
  ui/
actions/
lib/
  queries/
  supabase/
  validators/
supabase/
  schema.sql
  rls.sql
  seed.sql
types/
utils/
```

## 3. SQL Schema

Database scripts are provided here:

- `supabase/schema.sql`
- `supabase/seed.sql`

Primary tables:

- `profiles`
- `categories`
- `tags`
- `posts`
- `post_tags`
- `site_settings`
- `newsletter_subscribers`

Bonus fields included:

- `posts.reading_time`
- `posts.view_count`
- `posts.status = scheduled`

## 4. RLS Policies

All policies are in:

- `supabase/rls.sql`

Policy model:

- Public users can read published or due-scheduled posts, categories, tags, site settings, and public author profiles.
- Staff users (`admin`, `editor`) can manage posts, categories, tags, post tags, and storage objects.
- Admin users can manage site settings and read newsletter subscribers.
- Public users can insert newsletter subscriptions.

## 5. Environment Variables

Use `.env.example` as the baseline:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=news-media
```

## 6. Full Code For Main Files

Key entry points and implementation files:

- `app/layout.tsx`
- `app/(site)/page.tsx`
- `app/(site)/news/[slug]/page.tsx`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/posts/page.tsx`
- `components/admin/post-form.tsx`
- `components/editor/rich-text-editor.tsx`
- `components/forms/image-uploader.tsx`
- `lib/queries/public.ts`
- `lib/queries/admin.ts`
- `actions/posts.ts`
- `actions/categories.ts`
- `actions/tags.ts`
- `actions/settings.ts`

## 7. Setup Guide

1. Install dependencies.

```bash
npm install
```

2. Create a Supabase project and copy the project URL, anon key, and service role key into `.env.local`.

3. In Supabase SQL Editor, run the scripts in this order:

```sql
-- 1
\i supabase/schema.sql

-- 2
\i supabase/rls.sql

-- 3
\i supabase/seed.sql
```

If you are using the Supabase dashboard SQL editor, paste each file manually in the same order.

4. Create an auth user in Supabase Auth. After the user signs up once, promote the account:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

5. Start the application locally.

```bash
npm run dev
```

6. Open:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

7. Recommended production follow-up:

- Add your real domain to `NEXT_PUBLIC_APP_URL`
- Replace seed images and branding assets
- Configure a real newsletter workflow or ESP sync
- Add analytics and cron automation if you want scheduled posts promoted by background jobs rather than publish-time filtering
