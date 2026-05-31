alter table public.glucose_readings
  add column if not exists breakfast_notes text;

alter table public.glucose_readings
  add constraint glucose_readings_breakfast_notes_length
    check (breakfast_notes is null or char_length(breakfast_notes) <= 1000);
