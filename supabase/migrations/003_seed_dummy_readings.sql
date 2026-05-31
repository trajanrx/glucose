with users_to_seed as (
  select id as user_id
  from auth.users
),
days as (
  select
    user_id,
    (current_date - day_offset)::date as reading_date,
    row_number() over (partition by user_id order by day_offset desc) - 1 as idx
  from users_to_seed
  cross join generate_series(0, 30) as day_offset
),
dummy_rows as (
  select
    user_id,
    reading_date as date,
    round(92 + sin(idx * 1.7) * 9 + (idx % 5) * 3)::integer as fasting,
    round(105 + sin((idx + 2) * 1.7) * 12 + (idx % 5) * 3)::integer as pre_meal,
    round(145 + sin((idx + 4) * 1.7) * 22 + (idx % 5) * 3)::integer as post_meal,
    round(108 + sin((idx + 6) * 1.7) * 13 + (idx % 5) * 3)::integer as pre_dinner,
    round(152 + sin((idx + 8) * 1.7) * 24 + (idx % 5) * 3)::integer as post_dinner,
    (array[
      'Tostada integral con aguacate y cafe',
      'Arroz con pollo y ensalada',
      'Pasta con tomate y atun',
      'Lentejas con verduras',
      'Bocadillo pequeno y fruta',
      'Salmon con patata cocida',
      'Ensalada completa con garbanzos'
    ])[(idx % 7) + 1] as meal_notes,
    (array[
      'Tortilla francesa con ensalada',
      'Pescado al horno con verduras',
      'Crema de calabacin y yogur',
      'Pollo a la plancha con tomate',
      'Sopa y queso fresco',
      'Revuelto de champinones',
      'Verduras salteadas con tofu'
    ])[(idx % 7) + 1] as dinner_notes
  from days
)
insert into public.glucose_readings (
  user_id,
  date,
  fasting,
  pre_meal,
  post_meal,
  pre_dinner,
  post_dinner,
  meal_notes,
  dinner_notes
)
select
  user_id,
  date,
  fasting,
  pre_meal,
  post_meal,
  pre_dinner,
  post_dinner,
  meal_notes,
  dinner_notes
from dummy_rows dr
where not exists (
  select 1
  from public.glucose_readings gr
  where gr.user_id = dr.user_id
    and gr.date = dr.date
);
