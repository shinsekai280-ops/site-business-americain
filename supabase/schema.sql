-- ============================================================
--  Brandsmith site — database setup
--  Paste this whole file in Supabase > SQL Editor > New query, then click "Run".
--  You can run it again safely.
-- ============================================================

create extension if not exists pgcrypto;

-- Emails left on step 1 of the order (to follow up abandoned orders)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  package_id text,
  created_at timestamptz not null default now()
);

-- Paid orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  package_id text not null,
  upsell boolean not null default false,
  amount_cents integer not null default 0,
  currency text not null default 'usd',
  stripe_session_id text unique,
  stripe_payment_intent text,
  status text not null default 'awaiting_brief'
    check (status in ('awaiting_brief','in_progress','concepts_ready','revision_requested','approved','delivered','refunded')),
  brief jsonb,
  revisions_used integer not null default 0,
  refund_locked boolean not null default false,
  downloaded_at timestamptz,
  welcome_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_email_idx on public.orders(email);
create index if not exists orders_created_idx on public.orders(created_at);

-- Concepts and final files
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  kind text not null check (kind in ('concept','final')),
  storage_path text not null,
  file_name text not null,
  mime text,
  created_at timestamptz not null default now()
);
create index if not exists files_order_idx on public.files(order_id);

-- Client feedback (score out of 10 + comments)
create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  rating integer not null check (rating between 1 and 10),
  feedback text,
  created_at timestamptz not null default now()
);

-- Proof of each final file download (ends the refund eligibility)
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  file_id uuid references public.files(id) on delete set null,
  user_id uuid,
  ip text,
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- Security: nobody can read or write these tables from the browser.
-- The site reads and writes them only from the server, with the secret service key.
alter table public.leads enable row level security;
alter table public.orders enable row level security;
alter table public.files enable row level security;
alter table public.revisions enable row level security;
alter table public.downloads enable row level security;

-- Private storage bucket for the files (never public)
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;
