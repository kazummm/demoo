import QrMock from './QrMock'
import { SUB_TEXT } from './Status'
import type { QrBatchItem } from '../qrStore'

export function downloadQr(id: string, root: HTMLElement | null) {
  const svg = root?.querySelector('svg')
  if (!svg) return
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `QR-${id}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

export default function QrFullscreen({ batch, onClose }: { batch: QrBatchItem; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={`QR ${batch.id}`} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 p-6" style={{ background: '#ffffff' }} onClick={onClose}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl"><QrMock value={batch.id} size={340} /></div>
      <p className="font-mono text-3xl font-bold" style={{ color: '#001f3f' }}>{batch.id}</p>
      <p className="text-base" style={{ color: '#2b4a66' }}>{batch.jenis} · {batch.berat} kg · {batch.asal} → {batch.tujuan}</p>
      <button className="btn-primary min-h-14 max-w-sm text-lg font-bold" onClick={onClose}>Tutup</button>
      <span className="sr-only" style={{ color: SUB_TEXT }}>Ketuk mana saja untuk menutup</span>
    </div>
  )
}
