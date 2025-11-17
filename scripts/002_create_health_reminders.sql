-- Create health reminders table for vaccination schedules and checkups
create table if not exists public.health_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_name text not null,
  child_dob date not null,
  reminder_type text not null, -- 'vaccination', 'checkup', 'nutrition'
  reminder_title text not null,
  reminder_description text,
  due_date date not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.health_reminders enable row level security;

-- RLS policies for health reminders
create policy "health_reminders_select_own"
  on public.health_reminders for select
  using (auth.uid() = user_id);

create policy "health_reminders_insert_own"
  on public.health_reminders for insert
  with check (auth.uid() = user_id);

create policy "health_reminders_update_own"
  on public.health_reminders for update
  using (auth.uid() = user_id);

create policy "health_reminders_delete_own"
  on public.health_reminders for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists health_reminders_user_id_idx on public.health_reminders(user_id);
create index if not exists health_reminders_due_date_idx on public.health_reminders(due_date);
