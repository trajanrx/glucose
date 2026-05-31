import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import GlucoseTable from '../components/GlucoseTable'
import type { GlucoseReading } from '../types'

export default function HistorialPage() {
  const { user } = useAuth()
  const [readings, setReadings] = useState<GlucoseReading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data) setReadings(data)
        setLoading(false)
      })
  }, [user])

  return (
    <div>
      {loading ? (
        <p className="text-tremor-default text-tremor-content">Cargando...</p>
      ) : (
        <GlucoseTable readings={readings} />
      )}
    </div>
  )
}
