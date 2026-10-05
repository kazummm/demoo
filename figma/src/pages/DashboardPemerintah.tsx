import { govStats, monthlyShipments } from '../data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  onNavigate: (page: string) => void
}

const PATHS: Record<string, string> = {
  ship: 'M3 17l2 3h14l2-3M5 17V11h14v6M12 11V5M8 8h8',
  signal: 'M5 12a10 10 0 0114 0M8 15a6 6 0 018 0M12 19h.01',
  alert: 'M12 3L2 20h20L12 3zM12 10v4M12 17h.01',
  gauge: 'M4 18a9 9 0 1116 0M12 18l4-6',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  thermo: 'M14 14.8V5a2 2 0 00-4 0v9.8a4 4 0 104 0z',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5',
}

function Icon({ name, color, size = 26 }: { name: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

export default function DashboardPemerintah({ onNavigate }: Props) {
  const stats = [
    { label: 'Total Pengiriman', value: String(govStats.total), sub: '', color: '#06b6d4', icon: 'ship' },
    { label: 'Aktif', value: String(govStats.aktif), sub: '', color: '#60a5fa', icon: 'signal' },
    { label: 'Waspada/Risiko', value: String(govStats.waspada + govStats.risiko), sub: `${govStats.waspada} waspada · ${govStats.risiko} risiko`, color: '#fbbf24', icon: 'alert' },
    { label: 'Avg FrostScore', value: String(govStats.rataRataFrostScore), sub: '', color: '#34d399', icon: 'gauge' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Dashboard Pemerintah</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Dinas Kelautan Pangkep — pengawasan distribusi ikan antarpulau.</p>
      </div>

      {/* Big stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4 border text-center" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <div className="mb-1 flex justify-center"><Icon name={s.icon} color={s.color} /></div>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: '#64a0c8' }}>{s.label}</p>
            {s.sub && <p className="text-xs mt-0.5" style={{ color: '#93c1e0' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#e8f4fd' }}>Distribusi Bulanan per Status</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyShipments} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
            <XAxis dataKey="bulan" tick={{ fill: '#64a0c8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64a0c8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 12 }} />
            <Bar dataKey="aman" name="Aman" fill="#34d399" radius={[2,2,0,0]} />
            <Bar dataKey="waspada" name="Waspada" fill="#fbbf24" radius={[2,2,0,0]} />
            <Bar dataKey="risiko" name="Risiko" fill="#f87171" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>AKSES CEPAT</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Peta Distribusi', page: 'peta', icon: 'map' },
            { label: 'Analisis Data', page: 'analisis', icon: 'chart' },
            { label: 'Monitoring Suhu', page: 'monitoring', icon: 'thermo' },
            { label: 'Traceability', page: 'frosttrace', icon: 'search' },
          ].map((a) => (
            <button
              key={a.page}
              onClick={() => onNavigate(a.page)}
              className="rounded-xl p-4 text-left border transition-all hover:border-cyan-500/40"
              style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}
            >
              <div className="mb-2"><Icon name={a.icon} color="#06b6d4" size={22} /></div>
              <p className="text-sm font-medium" style={{ color: '#e8f4fd' }}>{a.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
