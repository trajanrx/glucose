import { useEffect, useState, useCallback } from 'react'

import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import GlucoseForm from '../components/GlucoseForm'
import GlucoseTable from '../components/GlucoseTable'
import GlucoseChart from '../components/GlucoseChart'
import type { GlucoseReading } from '../types'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [readings, setReadings] = useState<GlucoseReading[]>([])

  const fetchReadings = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (data) setReadings(data)
  }, [user])

  useEffect(() => { fetchReadings() }, [fetchReadings])

  return (
    <div className="min-h-screen bg-tremor-background-subtle">
      <header className="bg-tremor-background border-b border-tremor-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-tremor-title font-bold text-tremor-content-strong">Control de glucosa</h1>
            <p className="mt-0.5 text-tremor-label text-tremor-content">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-tremor-small border border-tremor-border bg-tremor-background px-3 py-1.5 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <GlucoseForm onSaved={fetchReadings} />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-6">
            <GlucoseChart readings={readings} />
            <GlucoseTable readings={readings} />
          </div>
        </div>
      </main>
    </div>
  )
}
