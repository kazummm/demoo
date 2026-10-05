import { useState } from 'react'
import { FrostRing } from '../components/StatusCard'
import { bottomNav } from '../components/Layout'

type Variant = 'normal' | 'alert'
type Conn = 'ONLINE' | 'SINKRON' | 'OFFLINE'

const SCREENS = {
  normal: {
    caption: 'Layar 1 · Kondisi Normal',
    suhu: 2.8,
    score: 95,
    scoreColor: '#22c55e',
    badge: 'Sistem Stabil',
    badgeCls: 'badge-aman',
    title: 'Semua Terkendali',
    note: 'Suhu stabil di bawah batas aman 4°C.',
    cardCls: 'status-aman',
    tempColor: '#4ade80',
    conn: 'ONLINE' as Conn,
  },
  alert: {
    caption: 'Layar 2 · Kondisi Peringatan',
    suhu: 4.2,
    score: 65,
    scoreColor: '#ef4444',
    badge: 'Tindakan Diperlukan',
    badgeCls: 'badge-risiko',
    title: 'Anomali Suhu',
    note: 'Suhu melewati batas aman 4°C. Segera tambahkan es.',
    cardCls: 'status-risiko',
    tempColor: '#ffffff',
    conn: 'ONLINE' as Conn,
  },
}

const CONN_CLS: Record<Conn, string> = { ONLINE: 'badge-online', SINKRON: 'badge-syncing', OFFLINE: 'badge-offline' }

function Phone({ variant }: { variant: Variant }) {
  const d = SCREENS[variant]
  const isAlert = variant === 'alert'
  const [logged, setLogged] = useState(false)

  return (
    <figure className="m-0 flex w-[390px] max-w-full flex-col items-center gap-3">
      <figcaption className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>{d.caption}</figcaption>

      <div
        className="relative flex h-[780px] w-full flex-col overflow-hidden rounded-[36px]"
        style={{ background: 'var(--background)', border: '6px solid #0a1e38', boxShadow: '0 20px 50px rgba(0,10,25,0.6), 0 0 0 1px rgba(232,244,253,0.2)' }}
      >
        <div className="cold-grid" />

        <header className="relative z-10 flex items-center justify-between gap-3 px-5 pb-3 pt-10">
          <div className="min-w-0">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Kapal Anda</p>
            <h2 className="truncate text-xl font-bold" style={{ color: 'var(--foreground)' }}>KM Cahaya Laut</h2>
          </div>
          <span className={`flex h-10 flex-shrink-0 items-center gap-2 rounded-full px-3 font-mono text-sm font-semibold ${CONN_CLS[d.conn]}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: 'currentColor' }} />
            {d.conn}
          </span>
        </header>

        <div className="relative z-10 flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4">
          <section className={`card flex flex-col gap-4 p-5 ${d.cardCls}`} aria-label={d.title}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{d.title}</h3>
              <span className="font-mono text-sm" style={{ color: 'var(--muted-foreground)' }}>10:20</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Suhu Saat Ini</span>
              <span
                className={`font-mono leading-none ${isAlert ? 'text-[64px] font-extrabold' : 'text-[56px] font-semibold'}`}
                style={{ color: d.tempColor }}
              >
                {d.suhu}°C
              </span>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${d.badgeCls} ${isAlert ? 'animate-pulse' : ''}`}
              role={isAlert ? 'alert' : 'status'}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: 'currentColor' }} />
              {d.badge}
            </span>

            <p className="text-sm leading-5" style={{ color: isAlert ? '#fee2e2' : 'var(--muted-foreground)' }}>{d.note}</p>
          </section>

          <section className="card flex items-center gap-5 p-5" aria-label="Skor mutu">
            <FrostRing score={d.score} color={d.scoreColor} />
            <div className="flex flex-col gap-1">
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Skor Mutu</span>
              <span className="font-mono text-2xl font-bold" style={{ color: d.scoreColor }}>
                {d.score}<span className="text-base" style={{ color: 'var(--muted-foreground)' }}> / 100</span>
              </span>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Batch <span className="font-mono">FR-001</span> · Ikan Kerapu</span>
            </div>
          </section>
        </div>

        {isAlert && (
          <div className="relative z-10 px-5 pb-3 pt-2">
            <button
              type="button"
              onClick={() => setLogged(true)}
              className="btn-primary min-h-16 text-xl font-bold"
              style={{ boxShadow: '0 8px 24px rgba(6,182,212,0.45)' }}
            >
              {logged ? 'Es Tercatat' : 'Tambah Es'}
            </button>
          </div>
        )}

        <nav className="relative z-10 grid grid-cols-4" style={{ background: '#0a1e38', borderTop: '1px solid rgba(6,182,212,0.25)' }} aria-label="Navigasi contoh">
          {bottomNav.map((item, i) => (
            <div
              key={item.id}
              className="relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold [&>span>svg]:h-6 [&>span>svg]:w-6"
              style={{ color: i === 0 ? '#06b6d4' : '#8fb8d6' }}
            >
              {i === 0 && <span className="absolute inset-x-6 top-0 h-[3px] rounded-b-full" style={{ background: '#06b6d4' }} />}
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>
    </figure>
  )
}

export default function PerbandinganLayar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Perbandingan Layar</h1>
        <p className="helper-text">Dashboard Nelayan pada kondisi normal dan kondisi peringatan.</p>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8">
        <Phone variant="normal" />
        <Phone variant="alert" />
      </div>
    </div>
  )
}
