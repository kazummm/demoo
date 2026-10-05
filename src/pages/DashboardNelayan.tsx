import { useEffect, useState } from 'react'
import { batches, alerts, shipmentStages, getFrostScoreCategory } from '../data'
import StatusCard from '../components/StatusCard'
import BrandLogo from '../components/BrandLogo'
import TechnicalDetail from '../components/TechnicalDetail'
import { getStatusFromSuhu, STATUS_META, SUB_TEXT } from '../components/Status'

interface Props {
  onNavigate: (page: string) => void
}

type Conn = 'online' | 'offline' | 'syncing'

const LOG_KEY = 'smartfrost.nelayan.logbook'

function loadLogs(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(LOG_KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

const CONN_ORDER: Conn[] = ['online', 'syncing', 'offline']

const CONN_META: Record<Conn, { label: string; text: string; cls: string; color: string }> = {
  online: { label: 'ONLINE', text: 'Terakhir sinkron 10:20 — data aman di server.', cls: 'badge-online', color: '#34d399' },
  syncing: { label: 'SINKRON', text: 'Menyinkronkan data ke server…', cls: 'badge-syncing', color: '#fbbf24' },
  offline: { label: 'OFFLINE', text: 'Data tersimpan lokal — dikirim otomatis saat sinyal kembali.', cls: 'badge-offline', color: '#f87171' },
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function formatDuration(mins: number) {
  return `${Math.floor(mins / 60)}j ${String(mins % 60).padStart(2, '0')}m`
}

function CloudIcon({ conn, color }: { conn: Conn; color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      {conn === 'offline' && (<><line x1="12" y1="10" x2="12" y2="14" /><line x1="12" y1="17" x2="12.01" y2="17" /></>)}
      {conn === 'syncing' && <path d="M12 17v-6m0 0l-2.5 2.5M12 11l2.5 2.5" />}
      {conn === 'online' && <path d="M9 14l2 2 4-4" />}
    </svg>
  )
}

export default function DashboardNelayan({ onNavigate }: Props) {
  const batch = batches[0]
  const alert = alerts.find((x) => x.batch === batch.id)
  const suhu = alert ? alert.suhu : batch.suhu
  const waktu = alert ? alert.waktu : '10:20'
  const { label: scoreLabel, color: scoreColor } = getFrostScoreCategory(batch.frostScore)
  const status = getStatusFromSuhu(suhu)
  const [conn, setConn] = useState<Conn>('online')
  const [log, setLog] = useState('')
  const [logs, setLogs] = useState<string[]>(loadLogs)
  const [showDetail, setShowDetail] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const meta = CONN_META[conn]

  useEffect(() => {
    if (status === 'RISIKO' && 'vibrate' in navigator) navigator.vibrate([2000])
  }, [status])

  useEffect(() => {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(logs))
    } catch {
      /* storage penuh atau diblokir */
    }
  }, [logs])

  const addLog = () => {
    const text = log.trim()
    if (!text) return
    const jam = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')
    setLogs((prev) => [`${jam}: ${text}`, ...prev])
    setLog('')
  }

  const elapsed = toMinutes('10:20') - toMinutes(shipmentStages[0].time)

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <header className="flex items-center gap-3">
        <BrandLogo variant="icon" width={36} className="hidden flex-shrink-0 rounded-lg md:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm" style={{ color: SUB_TEXT }}>{batch.nelayan}</p>
          <h1 className="truncate text-xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>{batch.kapal}</h1>
        </div>
        <button
          type="button"
          onClick={() => setConn(CONN_ORDER[(CONN_ORDER.indexOf(conn) + 1) % CONN_ORDER.length])}
          aria-label={`Status koneksi: ${meta.label}. ${meta.text}`}
          className={`flex min-h-12 flex-shrink-0 items-center gap-2 rounded-full px-3 font-mono text-sm font-semibold ${meta.cls}`}
        >
          <CloudIcon conn={conn} color={meta.color} />
          {meta.label}
        </button>
      </header>
      {conn !== 'online' && (
        <p role="status" className="text-sm" style={{ color: meta.color }}>{meta.text}</p>
      )}

      <StatusCard
        batchId={batch.id}
        jenis={batch.jenis}
        berat={batch.berat}
        suhu={suhu}
        status={status}
        waktu={waktu}
        score={batch.frostScore}
        scoreLabel={scoreLabel}
        scoreColor={scoreColor}
        durasi={formatDuration(elapsed)}
        acknowledged={acknowledged}
        onAcknowledge={() => setAcknowledged(true)}
      />

      <section className="card space-y-3 p-4" aria-label="Ringkasan monitoring">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Ringkasan Monitoring</h2>
          <button type="button" onClick={() => onNavigate('monitoring')} className="min-h-12 px-2 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            Lihat lengkap
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-sm" style={{ color: SUB_TEXT }}>Lokasi</dt>
            <dd className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Selat Makassar</dd>
          </div>
          <div>
            <dt className="text-sm" style={{ color: SUB_TEXT }}>GPS</dt>
            <dd className="font-mono text-base font-semibold" style={{ color: '#34d399' }}>ACTIVE</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm" style={{ color: SUB_TEXT }}>Kondisi</dt>
            <dd className="text-base font-semibold" style={{ color: STATUS_META[status].color }}>{status} · {STATUS_META[status].microcopy}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          aria-expanded={showDetail}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
          style={{ color: 'var(--primary)', border: '1px solid var(--border)', background: 'rgba(10,30,56,0.6)' }}
        >
          Detail Teknis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: showDetail ? 'rotate(180deg)' : undefined }}>
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>
        {showDetail && <TechnicalDetail />}
      </section>

      <section className="card space-y-3 p-4" aria-label="Logbook manual">
        <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Logbook Manual</h2>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            addLog()
          }}
        >
          <input
            type="text"
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder="contoh: Es diganti jam 9"
            aria-label="Catatan logbook"
            className="min-h-12 min-w-0 flex-1 rounded-lg px-3 text-base outline-none"
            style={{ background: '#0d2040', border: '1px solid rgba(6,182,212,0.2)', color: 'var(--foreground)' }}
          />
          <button type="submit" disabled={!log.trim()} className="btn-primary min-h-12 w-auto flex-shrink-0 px-5 font-bold disabled:opacity-50">
            Simpan
          </button>
        </form>
        {logs.length === 0 ? (
          <p className="text-sm" style={{ color: SUB_TEXT }}>Belum ada catatan.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((l, i) => (
              <li key={`${i}-${l}`} className="rounded-lg px-3 py-2 text-sm" style={{ background: '#0d2040', border: '1px solid rgba(6,182,212,0.12)', color: 'var(--foreground)' }}>
                {l}
              </li>
            ))}
          </ul>
        )}
      </section>

      <button onClick={() => onNavigate('buat-qr')} className="btn-primary min-h-14 text-lg font-bold">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M20 20h1v1" />
        </svg>
        Buat QR Batch
      </button>
    </div>
  )
}
