-- Supabase SQL Editor 中执行本文件。
-- 目标：邮箱登录后，每个用户只能访问自己的孩子档案和测量记录。

create extension if not exists pgcrypto;

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  sex text not null check (sex in ('male', 'female')),
  birth_date date not null,
  father_height numeric(5, 1),
  mother_height numeric(5, 1),
  bone_age_checked boolean not null default false,
  bone_age_years numeric(4, 1),
  puberty_breast boolean not null default false,
  puberty_menarche boolean not null default false,
  puberty_testis boolean not null default false,
  puberty_voice boolean not null default false,
  puberty_pubic_hair boolean not null default false,
  sleep_hours numeric(3, 1),
  exercise_days integer check (exercise_days >= 0 and exercise_days <= 7),
  milk_protein text check (milk_protein in ('good', 'partial', 'low') or milk_protein is null),
  picky_eating text check (picky_eating in ('no', 'mild', 'severe') or picky_eating is null),
  constipation boolean not null default false,
  rhinitis_adenoid boolean not null default false,
  recurrent_infections boolean not null default false,
  screen_hours numeric(3, 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.children add column if not exists bone_age_checked boolean not null default false;
alter table public.children add column if not exists bone_age_years numeric(4, 1);
alter table public.children add column if not exists puberty_breast boolean not null default false;
alter table public.children add column if not exists puberty_menarche boolean not null default false;
alter table public.children add column if not exists puberty_testis boolean not null default false;
alter table public.children add column if not exists puberty_voice boolean not null default false;
alter table public.children add column if not exists puberty_pubic_hair boolean not null default false;
alter table public.children add column if not exists sleep_hours numeric(3, 1);
alter table public.children add column if not exists exercise_days integer check (exercise_days >= 0 and exercise_days <= 7);
alter table public.children add column if not exists milk_protein text check (milk_protein in ('good', 'partial', 'low') or milk_protein is null);
alter table public.children add column if not exists picky_eating text check (picky_eating in ('no', 'mild', 'severe') or picky_eating is null);
alter table public.children add column if not exists constipation boolean not null default false;
alter table public.children add column if not exists rhinitis_adenoid boolean not null default false;
alter table public.children add column if not exists recurrent_infections boolean not null default false;
alter table public.children add column if not exists screen_hours numeric(3, 1);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  measured_at date not null,
  height_cm numeric(5, 1) not null check (height_cm > 30 and height_cm < 230),
  weight_kg numeric(5, 1) check (weight_kg > 1 and weight_kg < 200),
  note text,
  created_at timestamptz not null default now(),
  unique (child_id, measured_at)
);

alter table public.children enable row level security;
alter table public.measurements enable row level security;

drop policy if exists "children select own" on public.children;
drop policy if exists "children insert own" on public.children;
drop policy if exists "children update own" on public.children;
drop policy if exists "children delete own" on public.children;

create policy "children select own"
on public.children for select
using (auth.uid() = user_id);

create policy "children insert own"
on public.children for insert
with check (auth.uid() = user_id);

create policy "children update own"
on public.children for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "children delete own"
on public.children for delete
using (auth.uid() = user_id);

drop policy if exists "measurements select own" on public.measurements;
drop policy if exists "measurements insert own" on public.measurements;
drop policy if exists "measurements update own" on public.measurements;
drop policy if exists "measurements delete own" on public.measurements;

create policy "measurements select own"
on public.measurements for select
using (auth.uid() = user_id);

create policy "measurements insert own"
on public.measurements for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.children
    where children.id = measurements.child_id
      and children.user_id = auth.uid()
  )
);

create policy "measurements update own"
on public.measurements for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "measurements delete own"
on public.measurements for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists children_set_updated_at on public.children;
create trigger children_set_updated_at
before update on public.children
for each row execute function public.set_updated_at();
