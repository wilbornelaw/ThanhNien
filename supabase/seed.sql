insert into public.categories (name, slug, description)
values
  ('World', 'world', 'Global diplomacy, conflict, and international affairs.'),
  ('Politics', 'politics', 'Government, policy, elections, and political analysis.'),
  ('Business', 'business', 'Markets, companies, finance, and economic strategy.'),
  ('Technology', 'technology', 'Digital transformation, AI, cybersecurity, and platforms.'),
  ('Education', 'education', 'Learning systems, policy reform, and campus life.'),
  ('Culture', 'culture', 'Ideas, heritage, books, and visual culture.'),
  ('Entertainment', 'entertainment', 'Film, television, music, and celebrity industry coverage.'),
  ('Sports', 'sports', 'Major competitions, athlete profiles, and match analysis.'),
  ('Lifestyle', 'lifestyle', 'Food, design, people, and modern living.'),
  ('Law', 'law', 'Legal developments, justice, and regulatory affairs.'),
  ('Health', 'health', 'Medicine, public health, wellness, and care systems.'),
  ('Travel', 'travel', 'Destinations, aviation, hospitality, and travel culture.')
on conflict (slug) do nothing;

insert into public.tags (name, slug)
values
  ('Analysis', 'analysis'),
  ('Editorial', 'editorial'),
  ('Economy', 'economy'),
  ('Artificial Intelligence', 'artificial-intelligence'),
  ('Climate', 'climate'),
  ('Security', 'security'),
  ('Innovation', 'innovation'),
  ('Education Reform', 'education-reform'),
  ('Public Health', 'public-health'),
  ('Travel Trends', 'travel-trends')
on conflict (slug) do nothing;

insert into public.site_settings (
  site_name,
  footer_text,
  contact_email,
  social_links,
  default_seo_title,
  default_seo_description
)
values (
  'Thanh Nien Newspaper',
  'Thanh Nien Newspaper delivers premium digital reporting with a modern editorial voice and structured global coverage.',
  'info@thanhniennewspaper.com',
  '{"twitter":"https://twitter.com","facebook":"https://facebook.com","instagram":"https://instagram.com"}'::jsonb,
  'Thanh Nien Newspaper',
  'Premium digital coverage across world affairs, business, politics, technology, culture, and daily life.'
)
on conflict do nothing;

insert into public.posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  category_id,
  status,
  is_featured,
  is_breaking,
  seo_title,
  seo_description,
  canonical_url,
  published_at,
  reading_time,
  view_count
)
values
  (
    'Markets Reprice Global Growth Outlook as Central Banks Signal Diverging Paths',
    'markets-reprice-global-growth-outlook',
    'Investors recalibrate expectations after a week of mixed inflation data and competing policy signals from major economies.',
    '<p>Investors entered the week expecting a clear signal from monetary policymakers. Instead they received a split-screen picture: moderating inflation in some regions, stubborn price pressure in others, and a new round of debate about whether growth is slowing fast enough to justify rate cuts.</p><p>Analysts said the shifting tone has pushed portfolio managers back toward quality assets, while leaving cyclical sectors exposed to sharper swings. Currency markets reflected that uncertainty as traders reassessed relative policy trajectories.</p><h2>Why it matters</h2><p>For companies and households, the market repricing is not just an abstract financial event. It affects borrowing costs, equity valuations, and the pace of investment decisions across the real economy.</p>',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'business'),
    'published',
    true,
    true,
    'Markets Reprice Global Growth Outlook',
    'Global investors reassess rates, inflation, and the growth outlook after mixed central bank signals.',
    'https://example.com/news/markets-reprice-global-growth-outlook',
    timezone('utc', now()) - interval '3 hours',
    6,
    284
  ),
  (
    'Inside the Race to Build Practical AI Tools for Newsrooms',
    'inside-the-race-to-build-practical-ai-tools-for-newsrooms',
    'Publishers are moving from experimentation to workflow integration as AI products mature.',
    '<p>News organisations are shifting from curiosity to implementation. Instead of asking whether artificial intelligence belongs in the newsroom, executives are now asking which tasks can be improved without compromising editorial standards.</p><p>Editors say the most promising tools are those that speed up research, transcription, tagging, and distribution while preserving human judgment for framing, verification, and final publication.</p><h2>Operational pressure</h2><p>Faster publishing cycles and rising audience expectations are forcing digital teams to identify tools that reduce repetitive work and improve discoverability.</p>',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'technology'),
    'published',
    true,
    false,
    'Inside the Race to Build Practical AI Tools for Newsrooms',
    'How publishers are implementing AI tools for tagging, research, and digital workflow efficiency.',
    null,
    timezone('utc', now()) - interval '8 hours',
    5,
    198
  ),
  (
    'Education Reform Plans Put Teacher Workload at the Center of Policy Debate',
    'education-reform-plans-teacher-workload',
    'Officials say class quality cannot improve unless staffing pressure and administrative burden are addressed directly.',
    '<p>Education officials have reopened a long-running policy question: how to improve classroom outcomes without overloading teachers already stretched by administrative work, curriculum changes, and uneven staffing.</p><p>Reform proposals now focus on planning time, student support, and digital infrastructure alongside test performance and curriculum targets.</p>',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'education'),
    'published',
    false,
    false,
    'Education Reform Plans Put Teacher Workload at the Center of Policy Debate',
    'Education policy shifts focus to staffing pressure, classroom support, and teacher workload.',
    null,
    timezone('utc', now()) - interval '1 day',
    4,
    131
  ),
  (
    'How Urban Travel Is Being Redesigned Around Slower, Longer Stays',
    'urban-travel-redesigned-around-slower-stays',
    'Hotels, airlines, and city planners are adapting to a traveler who values flexibility over speed.',
    '<p>The travel sector is adjusting to a new pattern of demand. Instead of maximizing the number of destinations in a short trip, more travelers are booking longer stays and expecting neighborhoods, not just landmarks, to shape the experience.</p><p>That shift is changing how hospitality brands position properties, how airlines schedule routes, and how city governments think about tourism flows.</p>',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'travel'),
    'published',
    false,
    false,
    'How Urban Travel Is Being Redesigned Around Slower, Longer Stays',
    'Travel brands and cities adapt to longer stays, local experiences, and flexible itineraries.',
    null,
    timezone('utc', now()) - interval '2 days',
    4,
    117
  ),
  (
    'New Public Health Strategy Focuses on Early Detection Infrastructure',
    'new-public-health-strategy-focuses-on-early-detection',
    'Officials say prevention systems must improve before the next major healthcare shock arrives.',
    '<p>Public health leaders argue that resilience depends less on emergency response alone and more on whether clinics, labs, and local health systems can detect early signals before they become large-scale crises.</p><p>The latest strategy paper emphasises data coordination, local intervention capacity, and public communication systems that are easier to trust and easier to act on.</p>',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'health'),
    'draft',
    false,
    false,
    'New Public Health Strategy Focuses on Early Detection Infrastructure',
    'A draft report argues that prevention systems and local health infrastructure require sustained investment.',
    null,
    null,
    4,
    0
  ),
  (
    'Weekend Culture Guide: The Exhibitions, Screenings, and Scores Worth Your Time',
    'weekend-culture-guide-exhibitions-screenings-scores',
    'A scheduled weekend briefing rounds up the cultural events shaping the conversation.',
    '<p>From major museum retrospectives to late-night film screenings and headline sports fixtures, the weekend calendar is increasingly curated around experience as much as attendance. Editors say readers are looking for guidance, not just listings.</p><p>This scheduled briefing package is designed for mobile reading and fast decision-making, combining editorial voice with concise recommendations.</p>',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    (select id from public.categories where slug = 'culture'),
    'scheduled',
    true,
    false,
    'Weekend Culture Guide',
    'A scheduled guide to the exhibitions, screenings, and events worth planning around.',
    null,
    timezone('utc', now()) + interval '18 hours',
    3,
    0
  )
on conflict (slug) do nothing;

insert into public.post_tags (post_id, tag_id)
values
  (
    (select id from public.posts where slug = 'markets-reprice-global-growth-outlook'),
    (select id from public.tags where slug = 'economy')
  ),
  (
    (select id from public.posts where slug = 'markets-reprice-global-growth-outlook'),
    (select id from public.tags where slug = 'analysis')
  ),
  (
    (select id from public.posts where slug = 'inside-the-race-to-build-practical-ai-tools-for-newsrooms'),
    (select id from public.tags where slug = 'artificial-intelligence')
  ),
  (
    (select id from public.posts where slug = 'inside-the-race-to-build-practical-ai-tools-for-newsrooms'),
    (select id from public.tags where slug = 'innovation')
  ),
  (
    (select id from public.posts where slug = 'education-reform-plans-teacher-workload'),
    (select id from public.tags where slug = 'education-reform')
  ),
  (
    (select id from public.posts where slug = 'urban-travel-redesigned-around-slower-stays'),
    (select id from public.tags where slug = 'travel-trends')
  ),
  (
    (select id from public.posts where slug = 'new-public-health-strategy-focuses-on-early-detection'),
    (select id from public.tags where slug = 'public-health')
  )
on conflict do nothing;
