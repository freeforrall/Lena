-- IMPORTANT: Review this schema and policies with a security professional before storing sensitive data.
-- Supabase Auth handles accounts. Each pair creates a private workspace.
create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our shared space',
  created_at timestamptz not null default now()
);
create table if not exists public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('dom','sub')),
  primary key(workspace_id,user_id)
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  detail text,
  day_of_week text,
  due_at timestamptz,
  completed boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
-- Sensitive health entries are owned by the person who logs them.
-- Sharing is an explicit choice; do not expose private entries to the workspace by default.
create table if not exists public.cycle_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date,
  flow text,
  symptoms text,
  private_note text,
  shared_with_workspace boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  shared_with_workspace boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  shared_with_workspace boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql security definer set search_path=public
as $$ select exists(select 1 from public.workspace_members m where m.workspace_id=target_workspace and m.user_id=auth.uid()); $$;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.tasks enable row level security;
alter table public.rules enable row level security;
alter table public.cycle_logs enable row level security;
alter table public.checkins enable row level security;
alter table public.journal_entries enable row level security;

create policy "members read workspace" on public.workspaces for select using (public.is_workspace_member(id));
create policy "members see membership" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "members manage tasks" on public.tasks for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members manage rules" on public.rules for all using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "owner or explicitly shared cycle logs" on public.cycle_logs for select using (owner_id=auth.uid() or (shared_with_workspace and public.is_workspace_member(workspace_id)));
create policy "owner manages cycle logs" on public.cycle_logs for all using (owner_id=auth.uid()) with check (owner_id=auth.uid() and public.is_workspace_member(workspace_id));
create policy "owner or shared checkins" on public.checkins for select using (owner_id=auth.uid() or (shared_with_workspace and public.is_workspace_member(workspace_id)));
create policy "owner manages checkins" on public.checkins for all using (owner_id=auth.uid()) with check (owner_id=auth.uid() and public.is_workspace_member(workspace_id));
create policy "owner or shared journal" on public.journal_entries for select using (owner_id=auth.uid() or (shared_with_workspace and public.is_workspace_member(workspace_id)));
create policy "owner manages journal" on public.journal_entries for all using (owner_id=auth.uid()) with check (owner_id=auth.uid() and public.is_workspace_member(workspace_id));

-- Workspace creation and invitation flow should be implemented server-side using a trusted
-- server key. NEVER expose the Supabase service-role key in browser code.
