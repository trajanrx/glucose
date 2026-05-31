alter table public.glucose_readings
  add constraint glucose_readings_user_date_unique unique (user_id, date);
