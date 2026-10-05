import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getStatusColor, govStats, hotspots, monthlyShipments } from '../data'
import { StatusBadge } from '../components/Status'

interface Props {
  onNavigate: (page: string) => void
}

const panel = { background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }

export default function DashboardPemerintah({ onNavigate }: Props) {
  const totalStatus = govStats.selesai + govStats.waspada + govStats.risiko
  const statusRows = [
    { label: 'AMAN', value: govStats.selesai, color: getStatusColor('AMAN') },
    { label: 'WASPADA', value: govStats.waspada, color: getStatusColor('WASPADA') },
    { label: 'RISIKO', value: govStats.risiko, color: getStatusColor('RISIKO') },
  ] as const

  return (
    <div className="mt-5 space-y-5">
      <header className="rounded-2xl p-5" style={panel}>
        <p className="text-sm font-semibold tracking-wide" style={{ color: 'var(--primary)' }}>PEMERINTAH KABUPATEN PANGKEP</p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Dinas Kelautan dan Perikanan</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Pengawasan agregat rantai dingin hasil perikanan antarpulau.</p>
        <span className="badge-waspada mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold">Data simulasi prototipe</span>
      </header>

      <section aria-label="Ringkasan distribusi" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total Pengiriman', value: govStats.total, color: 'var(--primary)' },
          { label: 'Pengiriman Aktif', value: govStats.aktif, color: '#60a5fa' },
          { label: 'Waspada & Risiko', value: govStats.waspada + govStats.risiko, color: '#fbbf24' },
          { label: 'Rata-rata FrostScore', value: govStats.rataRataFrostScore, color: '#34d399' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-4" style={panel}>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
            <p className="mt-2 font-mono text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]">
        <section className="rounded-xl p-4" style={panel}>
          <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--foreground)' }}>Distribusi Pengiriman Bulanan</h2>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={monthlyShipments} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="bulan" tick={{ fill: '#93c1e0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#93c1e0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid var(--border)', borderRadius: 8, color: '#e8f4fd' }} />
              <Bar dataKey="aman" name="Aman" stackId="status" fill="#34d399" />
              <Bar dataKey="waspada" name="Waspada" stackId="status" fill="#fbbf24" />
              <Bar dataKey="risiko" name="Risiko" stackId="status" fill="#f87171" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl p-4" style={panel}>
          <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Distribusi Status</h2>
          <div className="my-5 flex h-3 overflow-hidden rounded-full" aria-label="Distribusi status pengiriman">
            {statusRows.map((item) => <span key={item.label} style={{ width: `${(item.value / totalStatus) * 100}%`, background: item.color }} />)}
          </div>
          <div className="space-y-3">
            {statusRows.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <StatusBadge status={item.label} size="sm" />
                <span className="font-mono text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Titik Rawan Teratas</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Lokasi dengan kejadian anomali terbanyak.</p>
          </div>
          <button onClick={() => onNavigate('peta')} className="min-h-12 rounded-lg px-4 text-sm font-semibold" style={{ color: 'var(--primary)', border: '1px solid var(--border)' }}>Lihat Peta</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {hotspots.slice(0, 3).map((item, index) => (
            <article key={item.lokasi} className="rounded-xl p-4" style={panel}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-lg font-bold" style={{ color: 'var(--primary)' }}>#{index + 1}</span>
                <StatusBadge status={item.status} size="sm" />
              </div>
              <h3 className="mt-3 font-semibold" style={{ color: 'var(--foreground)' }}>{item.lokasi}</h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.kejadian} kejadian · Rata-rata {item.suhuRata}°C</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
