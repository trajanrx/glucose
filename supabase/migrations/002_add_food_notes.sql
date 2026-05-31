alter table public.glucose_readings
  add column if not exists meal_notes text,
  add column if not exists dinner_notes text;
