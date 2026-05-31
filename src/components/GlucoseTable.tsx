import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge, Card } from '@tremor/react'
import type { GlucoseReading } from '../types'
import { READING_LABELS, READING_KEYS } from '../types'

interface Props {
  readings: GlucoseReading[]
}

function GlucoseBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-300">—</span>
  const color = value < 70 ? 'blue' : value <= 140 ? 'green' : value <= 180 ? 'yellow' : 'red'
  return <Badge color={color}>{value}</Badge>
}

export default function GlucoseTable({ readings }: Props) {
  return (
    <Card className="p-0">
      <div className="border-b border-tremor-border bg-tremor-background-muted px-4 py-3">
        <h2 className="text-tremor-default font-semibold text-tremor-content-strong">Historial</h2>
        <p className="text-tremor-label text-tremor-content">{readings.length} registros</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Fecha</TableHeaderCell>
              {READING_KEYS.map(key => (
                <TableHeaderCell key={key}>{READING_LABELS[key]}</TableHeaderCell>
              ))}
              <TableHeaderCell>Comida</TableHeaderCell>
              <TableHeaderCell>Cena</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400">Sin registros aún</TableCell>
              </TableRow>
            )}
            {readings.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.date}</TableCell>
                {READING_KEYS.map(key => (
                  <TableCell key={key}><GlucoseBadge value={r[key]} /></TableCell>
                ))}
                <TableCell className="max-w-xs whitespace-pre-wrap text-sm text-gray-600">
                  {r.meal_notes || <span className="text-gray-300">—</span>}
                </TableCell>
                <TableCell className="max-w-xs whitespace-pre-wrap text-sm text-gray-600">
                  {r.dinner_notes || <span className="text-gray-300">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-tremor-border bg-tremor-background-muted px-4 py-3 flex flex-wrap gap-4">
        <span className="flex items-center gap-1.5 text-tremor-label text-tremor-content"><Badge color="blue">—</Badge>Hipoglucemia &lt;70</span>
        <span className="flex items-center gap-1.5 text-tremor-label text-tremor-content"><Badge color="green">—</Badge>Normal 70–140</span>
        <span className="flex items-center gap-1.5 text-tremor-label text-tremor-content"><Badge color="yellow">—</Badge>Elevada 140–180</span>
        <span className="flex items-center gap-1.5 text-tremor-label text-tremor-content"><Badge color="red">—</Badge>Alta &gt;180</span>
      </div>
    </Card>
  )
}
