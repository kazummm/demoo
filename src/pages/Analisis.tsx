import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { govStats, hotspots, trendPeriods, type TrendPeriod } from '../data'
import { StatusBadge } from '../components/Status'

const panel = { background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }

function TrendChart({ title, data, color, temperature = false }: { title: string; data: { label: string; value: number }[]; color: string; temperature?: boolean }) {
  return (
    <section className="rounded-xl p-4" style={panel}>
      <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--foreground)' }}>{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fill: '#93c1e0', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={temperature ? [0, 7] : [60, 100]} tick={{ fill: '#93c1e0', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => temperature ? `${value}°` : value} />
          <Tooltip formatter={(value) => [temperature ? `${value}°C` : value, temperature ? 'Suhu' : 'FrostScore']} contentStyle={{ background: '#0a1e38', border: '1px solid var(--border)', borderRadius: 8, color: '#e8f4fd' }} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}

export default function Analisis() {
  const [period, setPeriod] = useState<TrendPeriod>('7hari')
  const trend = trendPeriods[period]

  return (
    <div className="mt-5 space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Analitik Rantai Dingin</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tren agregat kinerja distribusi dan titik rawan.</p>
          <span className="badge-waspada mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold">Data simulasi prototipe</span>
        </div>
        <label className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          Periode
          <select value={period} onChange={(event) => setPeriod(event.target.value as TrendPeriod)} className="input-field mt-1 min-h-12 min-w-40">
            {(Object.keys(trendPeriods) as TrendPeriod[]).map((key) => <option key={key} value={key}>{trendPeriods[key].label}</option>)}
          </select>
        </label>
      </header>

      <section aria-label="Ringkasan analitik" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: 'Pengiriman Selesai', value: govStats.selesai, color: '#34d399' },
          { label: 'Rata-rata Suhu', value: `${govStats.rataRataSuhu}°C`, color: 'var(--primary)' },
          { label: 'Rata-rata FrostScore', value: govStats.rataRataFrostScore, color: '#60a5fa' },
          { label: 'Total Peringatan', value: govStats.totalPeringatan, color: '#fbbf24' },
          { label: 'Durasi Rata-rata', value: `${govStats.rataRataDurasi} jam`, color: '#34d399' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-4" style={panel}>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
            <p className="mt-2 font-mono text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendChart title={`Tren Suhu · ${trend.label}`} data={trend.suhu} color="#06b6d4" temperature />
        <TrendChart title={`Tren FrostScore · ${trend.label}`} data={trend.frostScore} color="#60a5fa" />
      </div>

      <section>
        <h2 className="mb-3 text-base font-bold" style={{ color: 'var(--foreground)' }}>Analisis Lokasi</h2>
        <div className="hidden overflow-hidden rounded-xl md:block" style={panel}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(6,182,212,0.08)' }}>
                {['Lokasi', 'Kejadian', 'Suhu rata-rata', 'Tingkat'].map((heading) => <th key={heading} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {hotspots.map((item) => (
                <tr key={item.lokasi} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{item.lokasi}</td>
                  <td className="px-4 py-3 font-mono">{item.kejadian}x</td>
                  <td className="px-4 py-3 font-mono">{item.suhuRata}°C</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-3 md:hidden">
          {hotspots.map((item) => (
            <li key={item.lokasi} className="rounded-xl p-4" style={panel}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.lokasi}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.kejadian} kejadian · {item.suhuRata}°C rata-rata</p>
                </div>
                <StatusBadge status={item.status} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
