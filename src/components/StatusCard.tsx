import { StatusBadge, StatusIcon, STATUS_META, SUB_TEXT, type Status } from './Status'

export function FrostRing({ score, color, size = 112 }: { score: number; color: string; size?: number }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }} role="img" aria-label={`Skor mutu ${score} dari 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="52" pathLength={100} fill="none" stroke="rgba(232,244,253,0.14)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="52"
          pathLength={100}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - score}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold leading-none" style={{ color }}>{score}</span>
        <span className="mt-1 font-mono text-xs" style={{ color: SUB_TEXT }}>/ 100</span>
      </div>
    </div>
  )
}

const TONE: Record<Status, { bg: string; border: string }> = {
  AMAN: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.4)' },
  WASPADA: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.5)' },
  RISIKO: { bg: 'rgba(239,68,68,0.14)', border: '#ef4444' },
}

export function conditionSentence(suhu: number, status: Status) {
  if (status === 'AMAN') return `Suhu ${suhu}°C masih di dalam batas aman (≤ 4°C).`
  if (status === 'WASPADA') return `Suhu ${suhu}°C melewati 4°C, mendekati batas risiko 6°C.`
  return `Suhu ${suhu}°C melewati batas risiko 6°C.`
}

export function actionSentence(status: Status) {
  if (status === 'AMAN') return 'Suhu terjaga — lanjutkan perjalanan.'
  if (status === 'WASPADA') return 'Periksa es & pendinginan sekarang.'
  return 'Tangani sekarang: tambahkan es atau pindahkan ke cold storage.'
}

export function ThresholdChips({ compact = false }: { compact?: boolean }) {
  const items: { s: Status; t: string }[] = [
    { s: 'AMAN', t: '≤ 4°C' },
    { s: 'WASPADA', t: '4–6°C' },
    { s: 'RISIKO', t: '> 6°C' },
  ]
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Batas suhu">
      {items.map((i) => (
        <li key={i.s} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono ${compact ? 'text-xs' : 'text-xs'} ${STATUS_META[i.s].cls}`}>
          <StatusIcon status={i.s} size={12} />
          {i.t}
        </li>
      ))}
    </ul>
  )
}

interface AlertProps {
  batchId: string
  suhu: number
  status: Status
  waktu: string
  lokasi?: string
  detail?: string
  compact?: boolean
  acknowledged: boolean
  onAcknowledge?: () => void
  readOnly?: boolean
}

export function AlertCard({ batchId, suhu, status, waktu, lokasi, detail, compact = false, acknowledged, onAcknowledge, readOnly = false }: AlertProps) {
  const tone = TONE[status]
  const color = STATUS_META[status].color
  const sub = compact ? SUB_TEXT : 'var(--muted-foreground)'
  return (
    <section
      role={status === 'RISIKO' ? 'alert' : 'region'}
      aria-label={`${status}, batch ${batchId}`}
      className="rounded-xl p-4"
      style={{ background: tone.bg, border: `${status === 'RISIKO' ? 2 : 1}px solid ${tone.border}` }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-base font-bold" style={{ color }}>
          <StatusIcon status={status} size={20} />
          {status}
        </span>
        <span style={{ color: sub }}>·</span>
        <span className="font-mono text-base font-bold" style={{ color: 'var(--foreground)' }}>{batchId}</span>
        <span className="ml-auto font-mono text-sm" style={{ color: sub }}>{waktu}</span>
      </div>
      <p className="mt-2 text-base leading-6" style={{ color: 'var(--foreground)' }}>{conditionSentence(suhu, status)}</p>
      <p className="text-base font-semibold leading-6" style={{ color }}>{actionSentence(status)}</p>
      {lokasi && <p className="mt-1 text-sm" style={{ color: sub }}>{lokasi}</p>}
      {!compact && detail && <p className="mt-2 text-sm leading-5" style={{ color: sub }}>{detail}</p>}
      {compact && <div className="mt-3"><ThresholdChips compact /></div>}

      {status !== 'AMAN' && readOnly && (
        <div role="status" className={`mt-3 flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold ${acknowledged ? 'badge-aman' : 'badge-waspada'}`}>
          {acknowledged ? 'Sudah ditangani oleh operator' : 'Belum ditangani'}
        </div>
      )}
      {status !== 'AMAN' && !readOnly &&
        (acknowledged ? (
          <div role="status" className="badge-aman mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-base font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            Tercatat <span className="font-mono">{waktu}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAcknowledge}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-base font-bold transition-transform active:scale-[0.98]"
            style={{ background: status === 'RISIKO' ? '#ef4444' : '#f59e0b', color: status === 'RISIKO' ? '#ffffff' : '#1a1200', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Sudah Ditindak
          </button>
        ))}
    </section>
  )
}

interface HeroProps {
  batchId: string
  jenis: string
  berat: number
  suhu: number
  status: Status
  waktu: string
  score: number
  scoreLabel: string
  scoreColor: string
  durasi: string
  acknowledged: boolean
  onAcknowledge: () => void
  children?: React.ReactNode
}

export default function StatusCard(p: HeroProps) {
  const color = STATUS_META[p.status].color
  return (
    <section className="card space-y-4 p-5" aria-label={`Ringkasan batch ${p.batchId}`}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <FrostRing score={p.score} color={p.scoreColor} />
        <div>
          <p className="text-sm" style={{ color: SUB_TEXT }}>Kondisi Saat Ini</p>
          <div className="mt-1"><StatusBadge status={p.status} size="lg" /></div>
          <p className="mt-1 text-sm font-semibold" style={{ color }}>{STATUS_META[p.status].microcopy}</p>
          <p className="mt-2 text-sm" style={{ color: SUB_TEXT }}>
            Skor mutu: <span className="font-semibold" style={{ color: p.scoreColor }}>{p.scoreLabel}</span>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: '1px solid rgba(232,244,253,0.15)' }}>
        <div>
          <dt className="text-sm" style={{ color: SUB_TEXT }}>Suhu</dt>
          <dd className="font-mono text-5xl font-bold leading-none" style={{ color }}>{p.suhu}°C</dd>
        </div>
        <div>
          <dt className="text-sm" style={{ color: SUB_TEXT }}>Durasi</dt>
          <dd className="font-mono text-4xl font-bold leading-none" style={{ color: 'var(--foreground)' }}>{p.durasi}</dd>
        </div>
      </dl>

      {p.status !== 'AMAN' && (
        <AlertCard
          batchId={p.batchId}
          suhu={p.suhu}
          status={p.status}
          waktu={p.waktu}
          compact
          acknowledged={p.acknowledged}
          onAcknowledge={p.onAcknowledge}
        />
      )}

      {p.children}
    </section>
  )
}
