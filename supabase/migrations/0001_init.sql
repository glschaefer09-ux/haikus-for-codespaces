-- Cross PC AI — Cross PC Sync schema.
-- Personal-scale: every row is owned by exactly one auth.uid(), enforced by RLS below.
-- Applied via the Supabase MCP tool (apply_migration) once a project is provisioned.

create table if not exists devices (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  device_name text not null,
  platform text not null,
  app_version text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New conversation',
  model text not null default 'claude-sonnet-5',
  last_message_preview text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model text,
  device_id uuid references devices(id),
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_created_idx on messages (conversation_id, created_at);

-- Cross PC Sync is a paid add-on ($15/mo). This table is the source of truth for
-- whether a user's client is allowed to read/write conversations/messages at all
-- (enforced below via RLS, not just hidden in the UI).
create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'none' check (status in ('none', 'trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function touch_conversation() returns trigger as $$
begin
  update conversations
    set updated_at = now(),
        last_message_preview = left(new.content, 140)
    where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists messages_touch_conversation on messages;
create trigger messages_touch_conversation
  after insert on messages
  for each row execute function touch_conversation();

create or replace function has_active_sync_subscription(uid uuid) returns boolean as $$
  select exists (
    select 1 from subscriptions
    where user_id = uid and status in ('trialing', 'active')
  );
$$ language sql stable security definer set search_path = public;

alter table devices enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table subscriptions enable row level security;

create policy devices_all_own on devices for all
  using (auth.uid() = user_id and has_active_sync_subscription(auth.uid()))
  with check (auth.uid() = user_id and has_active_sync_subscription(auth.uid()));

create policy conversations_all_own on conversations for all
  using (auth.uid() = user_id and has_active_sync_subscription(auth.uid()))
  with check (auth.uid() = user_id and has_active_sync_subscription(auth.uid()));

create policy messages_all_own on messages for all
  using (auth.uid() = user_id and has_active_sync_subscription(auth.uid()))
  with check (auth.uid() = user_id and has_active_sync_subscription(auth.uid()));

-- Users can always read their own subscription row (to render paywall state);
-- only the service role (used by the Stripe webhook function) can write it.
create policy subscriptions_select_own on subscriptions for select
  using (auth.uid() = user_id);

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table subscriptions;
