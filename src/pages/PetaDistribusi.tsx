import { useState } from 'react'
import { getStatusColor, hotspots, routeRisks, type Hotspot } from '../data'
import { StatusBadge } from '../components/Status'

const panel = { background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }

export default function PetaDistribusi() {
  const [selected, setSelected] = useState<Hotspot>(hotspots[0])

  return (
    <div className="mt-5 space-y-5">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Peta Risiko Distribusi</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Pola risiko agregat per lokasi dan rute, tanpa posisi kapal individual.</p>
        <span className="badge-waspada mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold">Data simulasi prototipe</span>
      </header>

      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        {(['AMAN', 'WASPADA', 'RISIKO'] as const).map((status) => (
          <span key={status} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: getStatusColor(status) }} />
            {status} — tingkat risiko rute/lokasi
          </span>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl" style={panel} aria-label="Peta titik rawan distribusi">
        <svg width="100%" viewBox="0 0 600 400" className="min-h-72" role="img" aria-label="Peta agregat Kabupaten Pangkep dan Makassar">
          <rect width="600" height="400" fill="#071828" />
          {Array.from({ length: 20 }).map((_, index) => <line key={index} x1="0" y1={20 * index} x2="600" y2={20 * index} stroke="rgba(6,182,212,0.04)" />)}
          <path d="M0 120 Q60 80 130 100 L175 60 Q205 35 170 20 L80 25 Q25 55 0 90ZM0 190V400H260V355Q210 325 185 280Q145 235 90 220Q40 205 0 190Z" fill="rgba(15,52,96,0.75)" stroke="rgba(6,182,212,0.25)" />

          {routeRisks.map((route, index) => (
            <g key={index}>
              <line x1={route.from.x} y1={route.from.y} x2={route.to.x} y2={route.to.y} stroke={getStatusColor(route.status)} strokeWidth="5" strokeDasharray="9 6" opacity="0.68" />
              <text x={(route.from.x + route.to.x) / 2} y={(route.from.y + route.to.y) / 2 - 7} fill={getStatusColor(route.status)} fontSize="10" fontWeight="600" textAnchor="middle">{route.status}</text>
            </g>
          ))}

          {hotspots.map((item) => {
            const active = selected.lokasi === item.lokasi
            return (
              <g key={item.lokasi} role="button" tabIndex={0} aria-label={`${item.lokasi}, ${item.kejadian} kejadian, ${item.status}`} onClick={() => setSelected(item)} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelected(item)} className="cursor-pointer">
                <circle cx={item.x} cy={item.y} r={10 + item.kejadian} fill={`${getStatusColor(item.status)}33`} stroke={getStatusColor(item.status)} strokeWidth={active ? 4 : 2} />
                <circle cx={item.x} cy={item.y} r="4" fill={getStatusColor(item.status)} />
                <text x={item.x} y={item.y - 22} fill="#e8f4fd" fontSize="11" fontWeight="600" textAnchor="middle">{item.lokasi}</text>
              </g>
            )
          })}
          <text x="12" y="386" fill="#93c1e0" fontSize="10">PETA AGREGAT · BUKAN PELACAKAN KAPAL REALTIME</text>
        </svg>
      </section>

      <section className="rounded-xl p-4" style={panel} aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Titik dipilih</p>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{selected.lokasi}</h2>
          </div>
          <StatusBadge status={selected.status} />
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          {[
            ['Kejadian', `${selected.kejadian}x`],
            ['Suhu rata-rata', `${selected.suhuRata}°C`],
            ['FrostScore rata-rata', String(selected.avgFrostScore)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(0,31,63,0.65)' }}>
              <dt className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{label}</dt>
              <dd className="mt-1 font-mono text-lg font-bold" style={{ color: 'var(--foreground)' }}>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold" style={{ color: 'var(--foreground)' }}>Titik Rawan</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[...hotspots].sort((a, b) => b.kejadian - a.kejadian).map((item) => (
            <button key={item.lokasi} onClick={() => setSelected(item)} className="flex min-h-16 items-center gap-3 rounded-xl p-4 text-left" style={panel}>
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-mono font-bold" style={{ color: getStatusColor(item.status), background: `${getStatusColor(item.status)}22` }}>{item.kejadian}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold" style={{ color: 'var(--foreground)' }}>{item.lokasi}</span>
                <span className="block text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.suhuRata}°C · FrostScore {item.avgFrostScore}</span>
              </span>
              <StatusBadge status={item.status} size="sm" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
