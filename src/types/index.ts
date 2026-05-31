export interface GlucoseReading {
  id: string
  user_id: string
  date: string
  fasting: number | null
  pre_meal: number | null
  post_meal: number | null
  pre_dinner: number | null
  post_dinner: number | null
  breakfast_notes: string | null
  meal_notes: string | null
  dinner_notes: string | null
  created_at: string
}

export type ReadingKey = 'fasting' | 'pre_meal' | 'post_meal' | 'pre_dinner' | 'post_dinner'

export const READING_LABELS: Record<ReadingKey, string> = {
  fasting: 'Ayunas',
  pre_meal: 'Antes de comer',
  post_meal: '2h después de comer',
  pre_dinner: 'Antes de cenar',
  post_dinner: '2h después de cenar',
}

export const READING_KEYS: ReadingKey[] = ['fasting', 'pre_meal', 'post_meal', 'pre_dinner', 'post_dinner']
