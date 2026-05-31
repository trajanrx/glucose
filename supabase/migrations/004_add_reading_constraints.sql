alter table public.glucose_readings
  add constraint glucose_readings_fasting_range
    check (fasting is null or (fasting >= 0 and fasting <= 600)),
  add constraint glucose_readings_pre_meal_range
    check (pre_meal is null or (pre_meal >= 0 and pre_meal <= 600)),
  add constraint glucose_readings_post_meal_range
    check (post_meal is null or (post_meal >= 0 and post_meal <= 600)),
  add constraint glucose_readings_pre_dinner_range
    check (pre_dinner is null or (pre_dinner >= 0 and pre_dinner <= 600)),
  add constraint glucose_readings_post_dinner_range
    check (post_dinner is null or (post_dinner >= 0 and post_dinner <= 600)),
  add constraint glucose_readings_meal_notes_length
    check (meal_notes is null or char_length(meal_notes) <= 1000),
  add constraint glucose_readings_dinner_notes_length
    check (dinner_notes is null or char_length(dinner_notes) <= 1000);
