-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  heading text not null,
  price integer not null,
  discount integer not null check (discount >= 0 and discount <= 100),
  -- computed final price based on discount percentage
  final_price integer generated always as ((price - ((discount * price) / 100))) stored,
  fabric_category text not null,
  work_category text not null,
  measurement text,
  fabric text,
  work text,
  colour text,
  stitch_type text,
  care_guide text,
  no_of_pieces integer,
  available_colours_hex jsonb,
  trending boolean default false,
  is_hidden boolean default false,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for products
create index if not exists products_fabric_category_idx on public.products (fabric_category);
create index if not exists products_work_category_idx on public.products (work_category);
create index if not exists products_price_idx on public.products (price);
create index if not exists products_trending_idx on public.products (trending);
create index if not exists products_is_hidden_idx on public.products (is_hidden);
create index if not exists products_created_at_idx on public.products (created_at);
create index if not exists products_available_colours_hex_idx on public.products using gin (available_colours_hex);

-- Banners table
create table if not exists public.banners (
  id uuid primary key default uuid_generate_v4(),
  name text,
  image_url text not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Settings table (single row)
create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  active_banner_count integer default 3
);