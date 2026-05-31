create table public.glucose_readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  fasting integer,
  pre_meal integer,
  post_meal integer,
  pre_dinner integer,
  post_dinner integer,
  meal_notes text,
  dinner_notes text,
  created_at timestamptz default now()
);

alter table public.glucose_readings enable row level security;

create policy "Users can manage their own readings"
  on public.glucose_readings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
