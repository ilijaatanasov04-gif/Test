create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists categories_user_name_unique
on public.categories (user_id, lower(name));

alter table public.categories enable row level security;

drop policy if exists "select own categories" on public.categories;
create policy "select own categories"
on public.categories
for select
using (auth.uid() = user_id);

drop policy if exists "insert own categories" on public.categories;
create policy "insert own categories"
on public.categories
for insert
with check (auth.uid() = user_id);

drop policy if exists "update own categories" on public.categories;
create policy "update own categories"
on public.categories
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "delete own categories" on public.categories;
create policy "delete own categories"
on public.categories
for delete
using (auth.uid() = user_id);

create table if not exists public.recurring_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'MKD',
  frequency text not null default 'monthly' check (frequency in ('weekly', 'monthly', 'yearly')),
  description text,
  next_due_date date not null,
  created_at timestamptz not null default now()
);

alter table public.recurring_expenses add column if not exists currency text not null default 'MKD';
alter table public.recurring_expenses add column if not exists frequency text not null default 'monthly';
update public.recurring_expenses set currency = 'MKD' where currency is null;
update public.recurring_expenses set frequency = 'monthly' where frequency is null;
alter table public.recurring_expenses drop constraint if exists recurring_expenses_category_check;
alter table public.recurring_expenses enable row level security;

drop policy if exists "select own recurring_expenses" on public.recurring_expenses;
create policy "select own recurring_expenses"
on public.recurring_expenses
for select
using (auth.uid() = user_id);

drop policy if exists "insert own recurring_expenses" on public.recurring_expenses;
create policy "insert own recurring_expenses"
on public.recurring_expenses
for insert
with check (auth.uid() = user_id);

drop policy if exists "update own recurring_expenses" on public.recurring_expenses;
create policy "update own recurring_expenses"
on public.recurring_expenses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "delete own recurring_expenses" on public.recurring_expenses;
create policy "delete own recurring_expenses"
on public.recurring_expenses
for delete
using (auth.uid() = user_id);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  expense_date date not null,
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'MKD',
  description text,
  recurring_expense_id uuid references public.recurring_expenses(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.expenses add column if not exists recurring_expense_id uuid references public.recurring_expenses(id) on delete set null;
alter table public.expenses add column if not exists currency text not null default 'MKD';
update public.expenses set currency = 'MKD' where currency is null;
alter table public.expenses drop constraint if exists expenses_category_check;
create unique index if not exists expenses_recurring_date_unique
on public.expenses (user_id, recurring_expense_id, expense_date)
where recurring_expense_id is not null;

alter table public.expenses enable row level security;

drop policy if exists "select own expenses" on public.expenses;
create policy "select own expenses"
on public.expenses
for select
using (auth.uid() = user_id);

drop policy if exists "insert own expenses" on public.expenses;
create policy "insert own expenses"
on public.expenses
for insert
with check (auth.uid() = user_id);

drop policy if exists "update own expenses" on public.expenses;
create policy "update own expenses"
on public.expenses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "delete own expenses" on public.expenses;
create policy "delete own expenses"
on public.expenses
for delete
using (auth.uid() = user_id);
