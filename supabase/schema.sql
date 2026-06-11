-- ============================================================================
-- Greenlight — Time-off approvals
-- Supabase schema, row-level security policies, and signup trigger.
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query),
-- or via `supabase db push` if you use the Supabase CLI.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('requester', 'approver');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_status as enum ('pending', 'approved', 'denied', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.leave_type as enum ('vacation', 'sick', 'personal', 'other');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  role        public.user_role not null default 'requester',
  created_at  timestamptz not null default now()
);

create table if not exists public.time_off_requests (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references public.profiles (id) on delete cascade,
  leave_type    public.leave_type not null default 'vacation',
  start_date    date not null,
  end_date      date not null,
  reason        text not null default '',
  status        public.request_status not null default 'pending',
  reviewer_id   uuid references public.profiles (id),
  review_note   text,
  decided_at    timestamptz,
  created_at    timestamptz not null default now(),
  constraint valid_date_range check (end_date >= start_date)
);

create index if not exists time_off_requests_requester_idx
  on public.time_off_requests (requester_id);
create index if not exists time_off_requests_status_idx
  on public.time_off_requests (status);

-- ----------------------------------------------------------------------------
-- Helper: is the current user an approver?
-- SECURITY DEFINER avoids recursive RLS evaluation on `profiles`.
-- ----------------------------------------------------------------------------
create or replace function public.is_approver()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'approver'
  );
$$;

-- ----------------------------------------------------------------------------
-- Trigger: create a profile row whenever a new auth user signs up.
-- Reads full_name / role from the signup metadata.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'requester')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row-level security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.time_off_requests enable row level security;

-- Profiles: any authenticated user may read profiles (needed to show names);
-- a user may update only their own profile.
drop policy if exists "profiles readable by authenticated" on public.profiles;
create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Allow a user to create their own profile row as a fallback if the signup
-- trigger has not run (the trigger remains the primary path).
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- Requests: a requester sees their own; an approver sees all.
drop policy if exists "requests select own or approver" on public.time_off_requests;
create policy "requests select own or approver"
  on public.time_off_requests for select
  to authenticated
  using (requester_id = auth.uid() or public.is_approver());

-- A user may create requests only for themselves.
drop policy if exists "requests insert own" on public.time_off_requests;
create policy "requests insert own"
  on public.time_off_requests for insert
  to authenticated
  with check (requester_id = auth.uid());

-- A requester may update (e.g. cancel) their own request.
drop policy if exists "requests update own" on public.time_off_requests;
create policy "requests update own"
  on public.time_off_requests for update
  to authenticated
  using (requester_id = auth.uid())
  with check (requester_id = auth.uid());

-- An approver may update any request (to record a decision).
drop policy if exists "requests update by approver" on public.time_off_requests;
create policy "requests update by approver"
  on public.time_off_requests for update
  to authenticated
  using (public.is_approver())
  with check (public.is_approver());
