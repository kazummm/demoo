import { useState } from 'react'
import { alerts, getStatusColor, type Role } from '../data'
import { AlertCard } from '../components/StatusCard'
import { StatusBadge, getStatusFromSuhu, SUB_TEXT, type Status } from '../components/Status'

export default function Peringatan({ role }: { role: Role }) {
  const isNelayan = role === 'nelayan'
  const sub = isNelayan ? SUB_TEXT : '#64a0c8'
  const [acked, setAcked] = useState<Record<number, boolean>>({})

  return (
    <div className={`space-y-6 ${isNelayan ? 'mx-auto max-w-md' : ''}`}>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Peringatan Suhu</h1>
          <p className="text-sm mt-0.5" style={{ color: sub }}>Notifikasi otomatis saat suhu melewati batas aman.</p>
        </div>
        <span className="px-3 py-1 rounded-lg text-xs font-medium badge-waspada">{alerts.length} Peringatan Aktif</span>
      </div>

      {!isNelayan && (
        <div className="rounded-xl p-4 border flex items-start gap-3" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.15)' }}>
          <span className="text-xl flex-shrink-0" aria-hidden="true">🤖</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#06b6d4' }}>AI Anomaly Detection</p>
            <p className="text-xs mt-1" style={{ color: sub }}>
              Sistem AI mendeteksi kenaikan suhu yang tidak normal secara otomatis. Jika suhu naik lebih dari 1°C dalam 1 jam, sistem akan memberikan peringatan dini sebelum mencapai batas berbahaya.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((a) => (
          <AlertCard
            key={a.id}
            batchId={a.batch}
            suhu={a.suhu}
            status={getStatusFromSuhu(a.suhu)}
            waktu={a.waktu}
            lokasi={`${a.lokasi} · ${a.tanggal}`}
            compact={isNelayan}
            acknowledged={!!acked[a.id]}
            onAcknowledge={() => setAcked((p) => ({ ...p, [a.id]: true }))}
          />
        ))}
      </div>

      <div>
        <p className="text-xs font-medium mb-3" style={{ color: sub }}>BATAS PERINGATAN</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { suhu: '0 – 4°C', status: 'AMAN', desc: 'Tidak ada peringatan' },
            { suhu: '4 – 6°C', status: 'WASPADA', desc: 'Peringatan dikirim' },
            { suhu: '> 6°C', status: 'RISIKO', desc: 'Peringatan darurat' },
          ] as { suhu: string; status: Status; desc: string }[]).map(item => (
            <div key={item.status} className="rounded-xl p-3 border text-center" style={{ background: '#0d2040', borderColor: `${getStatusColor(item.status)}33` }}>
              <p className="text-sm font-bold font-mono mb-1" style={{ color: '#e8f4fd' }}>{item.suhu}</p>
              <StatusBadge status={item.status} size="sm" />
              <p className="text-xs mt-1" style={{ color: sub }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
