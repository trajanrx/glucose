import { useState } from 'react'
import { Card } from '@tremor/react'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceArea,
} from 'recharts'
import type { GlucoseReading } from '../types'
import { READING_LABELS, READING_KEYS } from '../types'

interface Props {
  readings: GlucoseReading[]
}

const LINE_COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#f97316', '#f43f5e']

// Zones: hypoglycemia <70, normal 70-140, elevated 140-180, high >180
const ZONES = [
  { y1: 70,  y2: 140, fill: '#f0fdf4', label: '70-140 Normal'   },
  { y1: 140, y2: 180, fill: '#fefce8', label: '140-180 Elevada' },
  { y1: 180, y2: 400, fill: '#fef2f2', label: '>180 Alta'       },
]

export default function GlucoseChart({ readings }: Props) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setHidden(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const data = [...readings]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      date: r.date,
      ...Object.fromEntries(READING_KEYS.map(key => [READING_LABELS[key], r[key]])),
    }))

  const allValues = readings.flatMap(r => READING_KEYS.map(k => r[k]).filter((v): v is number => v !== null))
  const yMax = Math.max(200, ...allValues) + 20

  return (
    <Card className="p-0">
      <div className="border-b border-tremor-border bg-tremor-background-muted px-4 py-3">
        <h2 className="text-tremor-default font-semibold text-tremor-content-strong">Evolución de glucosa</h2>
        <p className="text-tremor-label text-tremor-content">mg/dL · últimos registros</p>
      </div>
      <div className="px-4 py-4">
        {data.length < 2 ? (
          <p className="text-tremor-default text-tremor-content text-center py-14">Añade al menos dos registros para ver la gráfica.</p>
        ) : (
          <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {READING_KEYS.map((key, i) => {
              const isHidden = hidden.has(key)
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-1.5 rounded-tremor-full border px-3 py-1 text-tremor-label font-medium transition-opacity ${
                    isHidden
                      ? 'border-tremor-border bg-tremor-background text-tremor-content opacity-40'
                      : 'border-transparent bg-tremor-background-muted text-tremor-content-strong'
                  }`}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: LINE_COLORS[i] }}
                  />
                  {READING_LABELS[key]}
                </button>
              )
            })}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

              {ZONES.map(z => (
                <ReferenceArea
                  key={z.y1}
                  y1={z.y1}
                  y2={Math.min(z.y2, yMax)}
                  fill={z.fill}
                  fillOpacity={1}
                  ifOverflow="hidden"
                />
              ))}

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                domain={[70, yMax]}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                width={40}
                ticks={[70, 140, 180, yMax]}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: '#e5e7eb' }}
                formatter={(value) => [`${value} mg/dL`]}
              />

              {READING_KEYS.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={READING_LABELS[key]}
                  stroke={LINE_COLORS[i]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: LINE_COLORS[i] }}
                  activeDot={{ r: 5 }}
                  connectNulls
                  hide={hidden.has(key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  )
}
