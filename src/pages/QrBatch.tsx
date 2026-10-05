import { useRef, useState } from 'react'
import QrMock from '../components/QrMock'
import QrFullscreen, { downloadQr } from '../components/QrFullscreen'
import { SUB_TEXT } from '../components/Status'
import { useQrBatches, formatTanggal, type QrBatchItem } from '../qrStore'

function Card({ b, onView }: { b: QrBatchItem; onView: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <li className="card space-y-3 p-4">
      <div className="flex items-start gap-3">
        <div ref={ref} className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg"><QrMock value={b.id} size={64} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-lg font-bold" style={{ color: 'var(--primary)' }}>{b.id}</span>
            {b.aktif
              ? <span className="badge-aman rounded-full px-3 py-1 font-mono text-xs font-semibold">AKTIF</span>
              : <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold" style={{ background: 'rgba(147,193,224,0.15)', color: SUB_TEXT }}>SELESAI</span>}
          </div>
          <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{b.jenis} · {b.berat} kg</p>
          <p className="text-sm" style={{ color: SUB_TEXT }}>{b.asal} → {b.tujuan} · {b.kapal}</p>
          <p className="text-xs" style={{ color: SUB_TEXT }}>{formatTanggal(b.tanggalBerangkat)} · {b.distributor || '-'}</p>
          <p className="font-mono text-xs" style={{ color: SUB_TEXT }}>{b.dibuat}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-primary min-h-12 font-bold" onClick={onView}>Lihat QR</button>
        <button className="btn-secondary min-h-12" onClick={() => downloadQr(b.id, ref.current)}>Unduh</button>
      </div>
    </li>
  )
}

export default function QrBatch({ onNavigate }: { onNavigate: (p: string) => void }) {
  const list = useQrBatches()
  const [view, setView] = useState<QrBatchItem | null>(null)
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>QR Batch</h1>
        <p className="mt-0.5 text-sm" style={{ color: SUB_TEXT }}>QR batch yang sudah dibuat. Buat QR baru dari Dashboard.</p>
      </div>
      {list.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-8 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={SUB_TEXT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M20 20h1v1" /></svg>
          <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Belum ada QR batch</p>
          <button className="btn-primary min-h-12 font-bold" onClick={() => onNavigate('dashboard')}>Ke Dashboard</button>
        </div>
      ) : (
        <ul className="space-y-3">{list.map((b) => <Card key={b.id} b={b} onView={() => setView(b)} />)}</ul>
      )}
      {view && <QrFullscreen batch={view} onClose={() => setView(null)} />}
    </div>
  )
}
