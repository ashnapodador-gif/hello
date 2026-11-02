-- ============================================================
-- JSUNRISE BUSINESS WEBSITE — SUPABASE SCHEMA
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ---------- ADMIN PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create an admin profile for every new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  description text default '',
  price text default '',
  image_url text default '',
  featured boolean default false,
  in_stock boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- SERVICES ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  description text default '',
  image_url text default '',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- GALLERY ----------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'Store',  -- Interior | Exterior | Promotional
  image_url text not null default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- ANNOUNCEMENTS ----------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text default '',
  active boolean default true,
  created_at timestamptz default now()
);

-- ---------- BUSINESS HOURS ----------
create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null unique,   -- 0=Sunday ... 6=Saturday
  opens_at text default '10:00',
  closes_at text default '20:00',
  is_closed boolean default false
);

-- ---------- EDITABLE SITE CONTENT (key/value) ----------
create table if not exists public.site_content (
  key text primary key,
  value text not null default ''
);

-- ---------- CONTACT INFO (single row) ----------
create table if not exists public.contact_info (
  id int primary key default 1 check (id = 1),
  phone text default '',
  whatsapp text default '',
  email text default '',
  address text default '',
  map_embed_url text default '',
  directions_url text default '',
  facebook text default '',
  instagram text default '',
  twitter text default '',
  linkedin text default '',
  youtube text default '',
  updated_at timestamptz default now()
);

-- ---------- CUSTOMER INQUIRIES ----------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  type text not null default 'contact',        -- contact | product | service
  subject text default '',
  message text not null,
  status text not null default 'new',          -- new | read | replied
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.products        enable row level security;
alter table public.services       enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements  enable row level security;
alter table public.business_hours enable row level security;
alter table public.site_content    enable row level security;
alter table public.contact_info    enable row level security;
alter table public.inquiries       enable row level security;

-- Public can READ business data
create policy "public read products"        on public.products        for select using (true);
create policy "public read services"       on public.services       for select using (true);
create policy "public read gallery"        on public.gallery_images for select using (true);
create policy "public read announcements"  on public.announcements  for select using (true);
create policy "public read hours"          on public.business_hours for select using (true);
create policy "public read content"       on public.site_content   for select using (true);
create policy "public read contact"        on public.contact_info   for select using (true);

-- Public can SUBMIT inquiries (INSERT only)
create policy "public submit inquiries"     on public.inquiries     for insert with check (true);

-- Only ADMINS can WRITE business data
create policy "admin all products"        on public.products        for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all services"       on public.services       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all gallery"        on public.gallery_images  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all announcements"  on public.announcements   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all hours"          on public.business_hours  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all content"        on public.site_content    for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all contact"        on public.contact_info    for all using (public.is_admin()) with check (public.is_admin());

-- Inquiries: admins can read/update/delete
create policy "admin read inquiries"  on public.inquiries for select using (public.is_admin());
create policy "admin upd inquiries"  on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admin del inquiries"  on public.inquiries for delete using (public.is_admin());

-- Profiles: only owner can read their own
create policy "owner read profile" on public.profiles for select using (auth.uid() = id);

-- ============================================================
-- STORAGE BUCKET (admin photo uploads)
-- ============================================================
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"  on storage.objects for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "admin upd media"   on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "admin del media"   on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- ============================================================
-- SEED DATA — ALL MARKED VALUES ARE EDITABLE PLACEHOLDERS.
-- Update them anytime from the Admin Dashboard (no code edits needed).
-- ============================================================

-- Placeholder products (EDIT ME in Admin → Products)
insert into public.products (name, category, description, price, featured, sort_order) values
  ('Placeholder Product 1 — Edit me', 'General', 'Add a real product description here from the Admin Dashboard.', '[Price]', true, 1),
  ('Placeholder Product 2 — Edit me', 'General', 'Add a real product description here from the Admin Dashboard.', '[Price]', false, 2),
  ('Placeholder Product 3 — Edit me', 'General', 'Add a real product description here from the Admin Dashboard.', '[Price]', false, 3);

-- Placeholder services (EDIT ME in Admin → Services)
insert into public.services (name, category, description, featured, sort_order) values
  ('Placeholder Service 1 — Edit me', 'General', 'Describe a verified JSunrise service here.', true, 1),
  ('Placeholder Service 2 — Edit me', 'General', 'Describe a verified JSunrise service here.', false, 2);

-- Business hours (EDIT ME in Admin → Hours) — generic store defaults
insert into public.business_hours (day_of_week, opens_at, closes_at, is_closed) values
  (0, '10:00', '20:00', false),
  (1, '10:00', '20:00', false),
  (2, '10:00', '20:00', false),
  (3, '10:00', '20:00', false),
  (4, '10:00', '20:00', false),
  (5, '10:00', '20:00', false),
  (6, '10:00', '20:00', false)
on conflict (day_of_week) do nothing;

-- Editable site copy
insert into public.site_content (key, value) values
  ('hero_title',        'Welcome to JSunrise'),
  ('hero_subtitle',     'JSunrise Marketing Office and J-Sunrise Store — quality products, trusted service, and a commitment to our customers.'),
  ('home_intro',        'JSunrise Marketing Office and J-Sunrise Store is a local business in Pune, Maharashtra, serving our community with dedication. [EDIT ME — add your verified company introduction here via Admin → Content.]'),
  ('about_background',  '[EDIT ME — Company background goes here. Add verified history and background via Admin → Content.]'),
  ('mission',           '[EDIT ME — Mission statement goes here via Admin → Content.]'),
  ('vision',            '[EDIT ME — Vision statement goes here via Admin → Content.]'),
  ('about_company_info','[EDIT ME — Registration, founding year, and other company information via Admin → Content.]')
on conflict (key) do nothing;

-- Contact info — verified fields filled; placeholders clearly marked
insert into public.contact_info (id, phone, whatsapp, email, address, map_embed_url, directions_url) values (
  1,
  '[EDIT ME: phone]',
  '[EDIT ME: whatsapp]',
  '[EDIT ME: email]',
  '[EDIT ME: full street address], Pune, Maharashtra, India',
  'https://maps.google.com/maps?q=18.5035801,73.8746239&z=15&output=embed',
  'https://www.google.com/maps/place/JSunrise+Marketing+Office+and+J-Sunrise+Store/'
) on conflict (id) do nothing;
