with merged_readings as (
  select
    user_id,
    date,
    (array_agg(id order by created_at desc nulls last, id desc))[1] as keep_id,
    (array_agg(fasting order by created_at desc nulls last, id desc) filter (where fasting is not null))[1] as fasting,
    (array_agg(pre_meal order by created_at desc nulls last, id desc) filter (where pre_meal is not null))[1] as pre_meal,
    (array_agg(post_meal order by created_at desc nulls last, id desc) filter (where post_meal is not null))[1] as post_meal,
    (array_agg(pre_dinner order by created_at desc nulls last, id desc) filter (where pre_dinner is not null))[1] as pre_dinner,
    (array_agg(post_dinner order by created_at desc nulls last, id desc) filter (where post_dinner is not null))[1] as post_dinner,
    (array_agg(breakfast_notes order by created_at desc nulls last, id desc) filter (where breakfast_notes is not null))[1] as breakfast_notes,
    (array_agg(meal_notes order by created_at desc nulls last, id desc) filter (where meal_notes is not null))[1] as meal_notes,
    (array_agg(dinner_notes order by created_at desc nulls last, id desc) filter (where dinner_notes is not null))[1] as dinner_notes
  from public.glucose_readings
  group by user_id, date
  having count(*) > 1
)
update public.glucose_readings as reading
set
  fasting = coalesce(reading.fasting, merged_readings.fasting),
  pre_meal = coalesce(reading.pre_meal, merged_readings.pre_meal),
  post_meal = coalesce(reading.post_meal, merged_readings.post_meal),
  pre_dinner = coalesce(reading.pre_dinner, merged_readings.pre_dinner),
  post_dinner = coalesce(reading.post_dinner, merged_readings.post_dinner),
  breakfast_notes = coalesce(reading.breakfast_notes, merged_readings.breakfast_notes),
  meal_notes = coalesce(reading.meal_notes, merged_readings.meal_notes),
  dinner_notes = coalesce(reading.dinner_notes, merged_readings.dinner_notes)
from merged_readings
where reading.id = merged_readings.keep_id;

create table if not exists public.glucose_readings_duplicate_backup as
select
  reading.*,
  now()::timestamptz as deduped_at
from public.glucose_readings as reading
with no data;

with merged_readings as (
  select
    user_id,
    date,
    (array_agg(id order by created_at desc nulls last, id desc))[1] as keep_id
  from public.glucose_readings
  group by user_id, date
  having count(*) > 1
)
insert into public.glucose_readings_duplicate_backup
select
  reading.*,
  now()::timestamptz as deduped_at
from public.glucose_readings as reading
inner join merged_readings
  on reading.user_id = merged_readings.user_id
  and reading.date = merged_readings.date
  and reading.id <> merged_readings.keep_id;

with merged_readings as (
  select
    user_id,
    date,
    (array_agg(id order by created_at desc nulls last, id desc))[1] as keep_id
  from public.glucose_readings
  group by user_id, date
  having count(*) > 1
)
delete from public.glucose_readings as reading
using merged_readings
where reading.user_id = merged_readings.user_id
  and reading.date = merged_readings.date
  and reading.id <> merged_readings.keep_id;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'glucose_readings_user_date_unique'
      and conrelid = 'public.glucose_readings'::regclass
  ) then
    alter table public.glucose_readings
      add constraint glucose_readings_user_date_unique unique (user_id, date);
  end if;
end $$;
