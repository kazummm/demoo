import { useMemo } from 'react'
import { tempHistory, getStatusColor, type Status } from '../data'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { StatusBadge, getStatusFromSuhu, SUB_TEXT } from './Status'

const sub = SUB_TEXT
const box = { background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }

const thresholds: { range: string; status: Status; desc: string }[] = [
  { range: '0 – 4°C', status: 'AMAN', desc: 'Kondisi ideal untuk ikan segar' },
  { range: '4 – 6°C', status: 'WASPADA', desc: 'Perhatikan kondisi pendinginan' },
  { range: '> 6°C', status: 'RISIKO', desc: 'Segera tangani — risiko kerusakan' },
]

export default function TechnicalDetail() {
  const { chartData, minTemp, maxTemp, avgTemp, aiMsg } = useMemo(() => {
    const temps = tempHistory.map((h) => h.suhu)
    const last = temps.slice(-3)
    return {
      chartData: tempHistory.map((h) => ({ ...h })),
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      aiMsg: last.length === 3 && last[2] - last[0] > 1.5 ? `Kenaikan suhu ${(last[2] - last[0]).toFixed(1)}°C dalam 2 jam terakhir.` : null,
    }
  }, [])
  const status = getStatusFromSuhu(tempHistory[tempHistory.length - 1].suhu)

  return (
    <div className="space-y-4">
      {aiMsg && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <span aria-hidden="true">🤖</span>
          <p className="text-sm" style={{ color: '#fbbf24' }}>AI: {aiMsg}</p>
          <span className="ml-auto"><StatusBadge status={status} size="sm" /></span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Suhu Min', value: `${minTemp}°C`, color: '#34d399' },
          { label: 'Suhu Maks', value: `${maxTemp}°C`, color: '#f87171' },
          { label: 'Rata-rata', value: `${avgTemp}°C`, color: '#06b6d4' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-3" style={box}>
            <p className="mb-1 text-xs" style={{ color: sub }}>{s.label}</p>
            <p className="font-mono text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4" style={box}>
        <p className="mb-2 text-xs" style={{ color: sub }}>Lokasi GPS</p>
        <p className="font-mono text-sm font-medium" style={{ color: '#34d399' }}>ACTIVE</p>
        <p className="mt-1 font-mono text-xs" style={{ color: sub }}>-4.8672° S, 119.5314° E</p>
      </div>

      <div className="rounded-xl border p-4" style={box}>
        <p className="mb-3 text-sm font-semibold" style={{ color: '#e8f4fd' }}>Grafik Suhu vs Waktu</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
            <XAxis dataKey="time" tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 7]} tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}°`} />
            <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 12 }} formatter={(v) => [`${v}°C`, 'Suhu']} />
            <ReferenceLine y={4} stroke="rgba(251,191,36,0.5)" strokeDasharray="4 4" label={{ value: '4°C', fill: '#fbbf24', fontSize: 10 }} />
            <ReferenceLine y={6} stroke="rgba(248,113,113,0.5)" strokeDasharray="4 4" label={{ value: '6°C', fill: '#f87171', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="suhu"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props
                return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill={getStatusColor(getStatusFromSuhu(payload.suhu))} stroke="#0d2040" strokeWidth={1.5} />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium" style={{ color: sub }}>BATAS SUHU AMAN</p>
        <div className="grid grid-cols-3 gap-2">
          {thresholds.map((item) => (
            <div key={item.range} className="rounded-xl border p-3" style={{ background: '#0d2040', borderColor: `${getStatusColor(item.status)}33` }}>
              <StatusBadge status={item.status} size="sm" />
              <p className="mt-2 font-mono text-sm font-bold" style={{ color: getStatusColor(item.status) }}>{item.range}</p>
              <p className="mt-1 text-xs" style={{ color: sub }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
