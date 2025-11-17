-- Create chat history table for storing user conversations
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message_type text not null, -- 'user', 'assistant'
  message_content text not null,
  language text default 'en',
  context_type text, -- 'health', 'scheme', 'remedy'
  created_at timestamp with time zone default now()
);

alter table public.chat_history enable row level security;

-- RLS policies for chat history
create policy "chat_history_select_own"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "chat_history_insert_own"
  on public.chat_history for insert
  with check (auth.uid() = user_id);

create policy "chat_history_delete_own"
  on public.chat_history for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists chat_history_user_id_idx on public.chat_history(user_id);
create index if not exists chat_history_created_at_idx on public.chat_history(created_at desc);
