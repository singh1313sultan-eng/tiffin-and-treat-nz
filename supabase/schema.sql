-- ==============================================================================
-- TIFFIN & TREAT NZ - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Run this SQL in your Supabase Project SQL Editor (https://app.supabase.com)
-- to create all tables, indexes, realtime replication, and seed data.
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. STORES / BRANCH HUBS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.stores (
  id text primary key,
  name text not null,
  address text not null,
  suburb text not null,
  city text not null default 'Auckland',
  postcode text,
  phone text not null,
  pickup_time text not null default '15-20 min',
  delivery_time text not null default '30-45 min',
  delivery_fee numeric(10, 2) not null default 4.99,
  is_open boolean not null default true,
  opening_hours text not null default '11:00 AM - 10:30 PM (7 Days)',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. MENU ITEMS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category text not null, -- 'tiffins', 'pizzas', 'thalis', 'sides', 'drinks', 'desserts'
  price numeric(10, 2) not null,
  description text not null,
  image text not null,
  dietary text[] not null default '{}', -- array of 'halal', 'veg', 'vegan', 'gf', 'nut-free'
  spice_level integer default 1, -- 0 to 4
  calories integer,
  is_featured boolean default false,
  is_bestseller boolean default false,
  is_sold_out boolean default false,
  customization_options jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. CUSTOMERS TABLE (CRM & Loyalty)
-- ------------------------------------------------------------------------------
create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  primary_address text not null,
  apartment_unit text,
  suburb text not null,
  city text not null default 'Auckland',
  postcode text default '1011',
  total_orders integer not null default 0,
  total_spent numeric(10, 2) not null default 0.00,
  first_order_date text not null,
  last_order_date text not null,
  is_vip boolean not null default false,
  dietary_preferences text[] default '{}',
  favorite_items text[] default '{}',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS TABLE (Live KDS & Dispatch)
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  order_id text primary key,
  order_number text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_details jsonb not null,
  items jsonb not null, -- CartItem[] JSON representation
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null default 0.00,
  discount numeric(10, 2) not null default 0.00,
  applied_coupon text,
  tip numeric(10, 2) not null default 0.00,
  gst_amount numeric(10, 2) not null, -- 15% NZ GST component
  total_amount numeric(10, 2) not null,
  estimated_delivery_time text not null,
  status text not null default 'received', -- 'received', 'kitchen', 'packed', 'on_the_way', 'delivered', 'cancelled'
  store_id text references public.stores(id),
  store_data jsonb not null
);

-- ------------------------------------------------------------------------------
-- 5. STORE SETTINGS TABLE (Global Announcement & Operational Config)
-- ------------------------------------------------------------------------------
create table if not exists public.store_settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES FOR HIGH-SPEED LOOKUPS & REPORTING
-- ------------------------------------------------------------------------------
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_store on public.orders(store_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_menu_category on public.menu_items(category);
create index if not exists idx_menu_sold_out on public.menu_items(is_sold_out);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_phone on public.customers(phone);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.stores enable row level security;
alter table public.menu_items enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.store_settings enable row level security;

-- Permissive public read & write policies for storefront & admin operations
create policy "Allow all read stores" on public.stores for select using (true);
create policy "Allow all update stores" on public.stores for update using (true);

create policy "Allow all read menu" on public.menu_items for select using (true);
create policy "Allow all insert menu" on public.menu_items for insert with check (true);
create policy "Allow all update menu" on public.menu_items for update using (true);
create policy "Allow all delete menu" on public.menu_items for delete using (true);

create policy "Allow all read customers" on public.customers for select using (true);
create policy "Allow all insert customers" on public.customers for insert with check (true);
create policy "Allow all update customers" on public.customers for update using (true);

create policy "Allow all read orders" on public.orders for select using (true);
create policy "Allow all insert orders" on public.orders for insert with check (true);
create policy "Allow all update orders" on public.orders for update using (true);

create policy "Allow all read settings" on public.store_settings for select using (true);
create policy "Allow all upsert settings" on public.store_settings for all using (true);

-- ------------------------------------------------------------------------------
-- 8. ENABLE REALTIME SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
-- Allows the Kitchen KDS board and customer order tracker to receive live changes via WebSockets
begin;
  -- Drop if already exists to avoid errors on multiple runs
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.orders, 
    public.menu_items, 
    public.customers, 
    public.stores, 
    public.store_settings;
commit;

-- ------------------------------------------------------------------------------
-- 9. SEED DATA INITIALIZATION
-- ------------------------------------------------------------------------------

-- Seed Stores
insert into public.stores (id, name, address, suburb, city, postcode, phone, pickup_time, delivery_time, delivery_fee, is_open, opening_hours)
values 
  ('akl-ponsonby', 'Tiffin & Treat Ponsonby (Flagship Hub)', '142 Ponsonby Road, Ponsonby', 'Ponsonby', 'Auckland', '1011', '09 376 8920', '15-20 min', '30-40 min', 4.99, true, '11:00 AM - 10:30 PM (7 Days)'),
  ('akl-cbd', 'Tiffin & Treat Auckland CBD Express', '88 Queen Street, Auckland Central', 'CBD', 'Auckland', '1010', '09 309 4412', '10-15 min', '25-35 min', 4.50, true, '10:30 AM - 11:00 PM (7 Days)'),
  ('akl-takapuna', 'Tiffin & Treat Takapuna North Shore', '48 Hurstmere Road, Takapuna', 'Takapuna', 'Auckland', '0622', '09 489 7731', '15-20 min', '35-45 min', 5.50, true, '11:30 AM - 10:00 PM (Tue-Sun)'),
  ('akl-albany', 'Tiffin & Treat Albany Hub', '219 Don McKinnon Drive, Albany', 'Albany', 'Auckland', '0632', '09 415 6620', '20-25 min', '40-50 min', 5.99, true, '11:30 AM - 10:00 PM (7 Days)'),
  ('akl-manukau', 'Tiffin & Treat Manukau South Hub', '65 Cavendish Drive, Manukau', 'Manukau', 'Auckland', '2104', '09 262 1190', '15-20 min', '35-45 min', 5.50, true, '11:00 AM - 10:30 PM (7 Days)'),
  ('chc-central', 'Tiffin & Treat Christchurch Hub', '126 Oxford Terrace, Christchurch Central City', 'Christchurch Central', 'Christchurch', '8011', '03 365 9940', '15-20 min', '30-45 min', 4.99, true, '11:00 AM - 10:00 PM (Tue-Sun)')
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  phone = excluded.phone;

-- Seed Store Announcement
insert into public.store_settings (key, value)
values ('announcement_banner', '⚡ Free Gulab Jamun Sundae on all orders over NZD $45 across Auckland & Christchurch!')
on conflict (key) do update set value = excluded.value;

-- Seed Customers
insert into public.customers (id, name, email, phone, primary_address, suburb, city, postcode, total_orders, total_spent, first_order_date, last_order_date, is_vip, dietary_preferences, favorite_items, notes)
values
  ('cust-101', 'Sarah Jenkins', 'sarah.jenkins@gmail.com', '021 884 9231', '142 Ponsonby Road, Apt 4B', 'Ponsonby', 'Auckland', '1011', 14, 492.50, '2026-02-12', '2026-08-30', true, '{"halal","nut-free"}', '{"Royal Butter Chicken Dabba Meal", "Smoked Tandoori Chicken Tikka Pizza"}', 'Prefers contactless delivery on front porch table.'),
  ('cust-102', 'Liam O''Connor', 'liam.oc@outlook.co.nz', '022 419 8830', '88 Queen Street, Suite 1204', 'CBD', 'Auckland', '1010', 8, 268.00, '2026-04-05', '2026-08-29', false, '{"halal"}', '{"Artisanal Butter Chicken Feast Pizza", "Crispy Vegetable Samosas"}', 'Corporate lunchtime regular.'),
  ('cust-103', 'Priya Patel', 'priya.patel@nzmail.co.nz', '027 553 1092', '48 Hurstmere Road, Unit 2', 'Takapuna', 'Auckland', '0622', 21, 740.00, '2026-01-18', '2026-08-31', true, '{"veg"}', '{"Amritsari Paneer Tikka Dabba", "Smoked Paneer Makhani Pizza"}', 'Strict Vegetarian. Loves extra pickled shallots.')
on conflict (id) do nothing;
