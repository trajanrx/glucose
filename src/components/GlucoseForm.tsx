import { useState, useEffect } from 'react'
import { Card, NumberInput } from '@tremor/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { READING_LABELS, READING_KEYS } from '../types'
import type { ReadingKey } from '../types'

interface Props {
  onSaved: () => void
}

const inputCls = 'block w-full rounded-tremor-small border border-tremor-border bg-tremor-background px-3 py-2 text-sm text-tremor-content-strong shadow-tremor-input placeholder:text-tremor-content-subtle focus:border-tremor-brand focus:outline-none focus:ring-2 focus:ring-tremor-brand-muted'
const labelCls = 'mb-1.5 block text-tremor-default font-medium text-tremor-content-strong'

const EMPTY_VALUES: Record<ReadingKey, number | undefined> = {
  fasting: undefined, pre_meal: undefined, post_meal: undefined,
  pre_dinner: undefined, post_dinner: undefined,
}

export default function GlucoseForm({ onSaved }: Props) {
  const { user } = useAuth()
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [mealNotes, setMealNotes] = useState('')
  const [dinnerNotes, setDinnerNotes] = useState('')
  const [values, setValues] = useState<Record<ReadingKey, number | undefined>>(EMPTY_VALUES)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    setChecking(true)
    setSuccess(false)
    setError(null)
    supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExistingId(data.id)
          setValues({
            fasting: data.fasting ?? undefined,
            pre_meal: data.pre_meal ?? undefined,
            post_meal: data.post_meal ?? undefined,
            pre_dinner: data.pre_dinner ?? undefined,
            post_dinner: data.post_dinner ?? undefined,
          })
          setMealNotes(data.meal_notes ?? '')
          setDinnerNotes(data.dinner_notes ?? '')
        } else {
          setExistingId(null)
          setValues(EMPTY_VALUES)
          setMealNotes('')
          setDinnerNotes('')
        }
        setChecking(false)
      })
  }, [date, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      user_id: user.id,
      date,
      fasting: values.fasting ?? null,
      pre_meal: values.pre_meal ?? null,
      post_meal: values.post_meal ?? null,
      pre_dinner: values.pre_dinner ?? null,
      post_dinner: values.post_dinner ?? null,
      meal_notes: mealNotes.trim() || null,
      dinner_notes: dinnerNotes.trim() || null,
    }

    const { error } = existingId
      ? await supabase.from('glucose_readings').update(payload).eq('id', existingId)
      : await supabase.from('glucose_readings').insert(payload)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      onSaved()
    }
    setLoading(false)
  }

  const isEditing = existingId !== null

  return (
    <Card className="p-0">
      <div className="border-b border-tremor-border bg-tremor-background-muted px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-tremor-default font-semibold text-tremor-content-strong">Registrar glucosa</h2>
          <p className="text-tremor-label text-tremor-content">Introduce los valores del día</p>
        </div>
        {checking && <span className="text-tremor-label text-tremor-content">Comprobando...</span>}
        {!checking && isEditing && (
          <span className="rounded-tremor-full bg-amber-50 px-2.5 py-1 text-tremor-label font-medium text-amber-700 border border-amber-200">
            Editando registro existente
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-tremor-border">
        <div className="px-4 py-4 space-y-1">
          <label className={labelCls}>Fecha</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
        </div>

        <div className="px-4 py-4">
          <p className={labelCls}>
            Mediciones <span className="font-normal text-tremor-content text-tremor-label">mg/dL</span>
          </p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {READING_KEYS.map(key => (
              <div key={key}>
                <label className="mb-1 block text-tremor-label text-tremor-content">{READING_LABELS[key]}</label>
                <NumberInput
                  placeholder="—"
                  min={0}
                  max={600}
                  value={values[key]}
                  onValueChange={v => setValues(prev => ({ ...prev, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>¿Qué has comido?</label>
            <textarea
              value={mealNotes}
              onChange={e => setMealNotes(e.target.value)}
              rows={3}
              placeholder="Ej. arroz con pollo, ensalada, yogur..."
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className={labelCls}>¿Qué has cenado?</label>
            <textarea
              value={dinnerNotes}
              onChange={e => setDinnerNotes(e.target.value)}
              rows={3}
              placeholder="Ej. pescado, verduras, tortilla..."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          {error && <p className="rounded-tremor-small bg-red-50 px-3 py-2 text-tremor-default text-red-700">{error}</p>}
          {success && <p className="rounded-tremor-small bg-emerald-50 px-3 py-2 text-tremor-default text-emerald-700">Guardado correctamente.</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-tremor-small bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis disabled:opacity-60 transition-colors"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </Card>
  )
}
