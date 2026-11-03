create table settings (key text primary key, value text not null default '');
insert into settings(key,value) values
('business_name','JSunrise Marketing Office and J-Sunrise Store'),('hero_image_url',''),
('welcome','Welcome to JSunrise Marketing — Your Trusted Destination for Quality and Service.'),
('intro',''),('mission',''),('vision',''),('goals',''),('values',''),('background',''),
('phone',''),('email',''),('facebook',''),('whatsapp',''),('hours','');
create table products (id uuid primary key default gen_random_uuid(), kind text not null default 'product' check (kind in ('product','service')),
 name text not null, category text not null default 'General', description text default '', price numeric, available boolean default true, created_at timestamptz default now());
create table inquiries (id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, message text not null, created_at timestamptz default now());
alter table settings enable row level security; alter table products enable row level security; alter table inquiries enable row level security;
create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all to authenticated using (true) with check (true);
create policy "public read products" on products for select using (true);
create policy "admin write products" on products for all to authenticated using (true) with check (true);
create policy "anyone can inquire" on inquiries for insert to anon, authenticated with check (char_length(message) between 1 and 2000);
create policy "admin read inquiries" on inquiries for select to authenticated using (true);
create policy "admin delete inquiries" on inquiries for delete to authenticated using (true);
insert into storage.buckets(id,name,public) values('site','site',true) on conflict do nothing;
create policy "public read site" on storage.objects for select using (bucket_id='site');
create policy "admin upload site" on storage.objects for all to authenticated using (bucket_id='site') with check (bucket_id='site');
