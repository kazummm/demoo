import { useRef, useState } from 'react'
import QrMock from '../components/QrMock'
import QrFullscreen, { downloadQr } from '../components/QrFullscreen'
import { qrStore, formatTanggal } from '../qrStore'

export default function QrSiap({ onNavigate }: { onNavigate: (p: string) => void }) {
  const b = qrStore.lastCreated() ?? qrStore.get()[0]
  const [full, setFull] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  if (!b) return null
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="badge-aman mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-2 text-base font-semibold">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 12.5l3 3 5-6" /></svg>
        QR siap ditempel
      </div>
      <div ref={ref} className="rounded-3xl bg-white p-5 text-center">
        <div className="mx-auto w-60 max-w-full"><QrMock value={b.id} size={240} /></div>
        <p className="mt-3 font-mono text-2xl font-bold" style={{ color: '#001f3f' }}>{b.id}</p>
        <p className="text-sm" style={{ color: '#2b4a66' }}>{b.jenis} · {b.berat} kg · {b.asal} → {b.tujuan}</p>
        <p className="text-sm" style={{ color: '#2b4a66' }}>Distributor: {b.distributor || '-'} · Berangkat {formatTanggal(b.tanggalBerangkat)}</p>
      </div>
      <button className="btn-primary min-h-14 text-lg font-bold" onClick={() => setFull(true)}>Tampilkan QR</button>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary min-h-12" onClick={() => downloadQr(b.id, ref.current)}>Unduh QR</button>
        <button className="btn-secondary min-h-12" onClick={() => window.print()}>Cetak</button>
      </div>
      <button className="min-h-12 w-full text-base font-semibold" style={{ color: 'var(--primary)' }} onClick={() => onNavigate('qr-batch')}>Selesai</button>
      {full && <QrFullscreen batch={b} onClose={() => setFull(false)} />}
    </div>
  )
}
