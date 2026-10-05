import { visibleAlerts } from '../session'
import { useState } from 'react'
import { getStatusColor, type Role } from '../data'
import { AlertCard } from '../components/StatusCard'
import { StatusBadge, getStatusFromSuhu, STATUS_RANK, SUB_TEXT, type Status } from '../components/Status'

export default function Peringatan({ role }: { role: Role }) {
  const isNelayan = role === 'nelayan'
  const isPemerintah = role === 'pemerintah'
  const sub = SUB_TEXT
  const [acked, setAcked] = useState<Record<number, boolean>>({})
  const shownAlerts = [...visibleAlerts()].sort((a, b) => STATUS_RANK[getStatusFromSuhu(a.suhu)] - STATUS_RANK[getStatusFromSuhu(b.suhu)])

  return (
    <div className={`space-y-6 ${isNelayan ? 'mx-auto max-w-md' : ''}`}>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Peringatan Suhu</h1>
          <p className="text-sm mt-0.5" style={{ color: sub }}>Notifikasi otomatis saat suhu melewati batas aman.</p>
          {isPemerintah && <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--primary)' }}>Mode lihat saja · Data simulasi prototipe</p>}
        </div>
        <span className="badge-waspada rounded-lg px-3 py-1 text-sm font-medium">{shownAlerts.length} Peringatan Aktif</span>
      </div>

      {!isNelayan && (
        <div className="rounded-xl p-4 border flex items-start gap-3" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.15)' }}>
          <svg className="h-6 w-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" aria-hidden="true"><path d="M12 2v3M8 8h8a4 4 0 014 4v7H4v-7a4 4 0 014-4Z" /><circle cx="9" cy="13" r="1" fill="currentColor" /><circle cx="15" cy="13" r="1" fill="currentColor" /></svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#06b6d4' }}>AI Anomaly Detection</p>
            <p className="mt-1 text-sm" style={{ color: sub }}>
              Sistem AI mendeteksi kenaikan suhu yang tidak normal secara otomatis. Jika suhu naik lebih dari 1°C dalam 1 jam, sistem akan memberikan peringatan dini sebelum mencapai batas berbahaya.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {shownAlerts.map((a) => (
          <AlertCard
            key={a.id}
            batchId={a.batch}
            suhu={a.suhu}
            status={getStatusFromSuhu(a.suhu)}
            waktu={a.waktu}
            lokasi={`${a.lokasi} · ${a.tanggal}`}
            compact={isNelayan}
            acknowledged={isPemerintah ? a.id !== 2 : !!acked[a.id]}
            onAcknowledge={isPemerintah ? undefined : () => setAcked((p) => ({ ...p, [a.id]: true }))}
            readOnly={isPemerintah}
          />
        ))}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium" style={{ color: sub }}>BATAS PERINGATAN</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { suhu: '0 – 4°C', status: 'AMAN', desc: 'Tidak ada peringatan' },
            { suhu: '4 – 6°C', status: 'WASPADA', desc: 'Peringatan dikirim' },
            { suhu: '> 6°C', status: 'RISIKO', desc: 'Peringatan darurat' },
          ] as { suhu: string; status: Status; desc: string }[]).map(item => (
            <div key={item.status} className="rounded-xl p-3 border text-center" style={{ background: '#0d2040', borderColor: `${getStatusColor(item.status)}33` }}>
              <p className="text-sm font-bold font-mono mb-1" style={{ color: '#e8f4fd' }}>{item.suhu}</p>
              <StatusBadge status={item.status} size="sm" />
              <p className="mt-1 text-sm" style={{ color: sub }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
