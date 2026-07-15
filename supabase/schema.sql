-- run in Supabase SQL editor

create table if not exists cases (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  specialty text not null,
  type text not null check (type in ('photo', 'video')),
  duration text not null default '',
  description text not null default '',
  media_url text,
  premium boolean not null default false,
  sensitive boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  journal text not null,
  year text not null,
  pdf_url text,
  premium boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  excerpt text not null default '',
  cover_url text,
  date text not null,
  published_at timestamptz default now()
);

create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  initial text not null,
  plan text not null,
  since text not null,
  status text not null check (status in ('active', 'free', 'paused')),
  created_at timestamptz default now()
);
