import { batches, shipmentStages } from '../data'
import { useQrBatches, todayIso, formatTanggal } from '../qrStore'
import { StatusBadge, getStatusFromSuhu } from './Status'

interface Stage {
  name: string
  time: string
  lokasi: string
  suhu?: number
  done: boolean
}

const DONE_STAGES = shipmentStages.filter((s) => s.done).length

function stagesFromSensor(batchId: string): Stage[] | null {
  const b = batches.find((x) => x.id === batchId)
  if (!b) return null
  const lastDone = shipmentStages[DONE_STAGES - 1].suhu
  const delta = b.suhu - lastDone
  return shipmentStages.map((st, i) => {
    if (!st.done) return { name: st.name, time: st.time, lokasi: st.lokasi, done: false }
    const ramp = (i + 1) / DONE_STAGES
    return { name: st.name, time: st.time, lokasi: st.lokasi, suhu: Math.round((st.suhu + delta * ramp) * 10) / 10, done: true }
  })
}

export default function FrostTraceTimeline({ batchId, accent = '#3b82f6', privacy = false }: { batchId: string; accent?: string; privacy?: boolean }) {
  const qr = useQrBatches()
  let stages = stagesFromSensor(batchId)
  if (!stages) {
    const q = qr.find((x) => x.id === batchId)
    const berangkat = !!q?.tanggalBerangkat && q.tanggalBerangkat <= todayIso()
    stages = [
      { name: 'QR dibuat', time: q?.dibuat ?? '-', lokasi: q ? `${q.asal} · ${q.kapal}` : '-', done: !!q },
      { name: 'Berangkat', time: q?.tanggalBerangkat ? formatTanggal(q.tanggalBerangkat) : '-', lokasi: q?.asal ?? '-', done: berangkat },
      { name: 'Dalam perjalanan', time: '-', lokasi: 'Menunggu data sensor', done: false },
      { name: 'Tiba di gudang distributor', time: '-', lokasi: q?.tujuan ?? '-', done: false },
    ]
  }
  return (
    <ol aria-label="Riwayat perjalanan" className="relative space-y-4 pl-6">
      <span className="absolute bottom-2 left-[7px] top-2 w-px" style={{ background: 'rgba(147,197,253,0.3)' }} />
      {stages.map((st) => {
        const lokasi = privacy && (st.name === 'Kapal' || st.lokasi.startsWith('KM ')) ? 'Transportasi laut' : st.lokasi
        return (
        <li key={st.name} className="relative">
          <span
            className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full"
            style={{ background: st.done ? accent : 'transparent', border: `2px solid ${accent}` }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{st.name}</p>
            {st.done && st.suhu !== undefined ? (
              <StatusBadge status={getStatusFromSuhu(st.suhu)} size="sm" />
            ) : (
              <span className="text-sm font-semibold" style={{ color: '#93c1e0' }}>{st.done ? 'Tercatat' : 'Belum tercapai'}</span>
            )}
          </div>
          <p className="text-sm" style={{ color: '#93c1e0' }}>
            <span className="font-mono">{st.time}</span> · {lokasi}
            {st.done && st.suhu !== undefined && <> · <span className="font-mono">{st.suhu}°C</span></>}
          </p>
        </li>
        )
      })}
    </ol>
  )
}
