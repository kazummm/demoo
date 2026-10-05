import { useSyncExternalStore } from 'react'

export interface QrBatchItem {
  id: string
  jenis: string
  berat: number
  asal: string
  tujuan: string
  kapal: string
  perangkat: string
  dibuat: string
  aktif: boolean
  tanggalBerangkat?: string
  distributor?: string
  nelayan?: string
}

export function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatTanggal(iso?: string) {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return '-'
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

let items: QrBatchItem[] = [
  { id: 'FR-003', jenis: 'Ikan Kerapu', berat: 120, asal: 'Pangkep', tujuan: 'Makassar', kapal: 'KM Cahaya Laut', perangkat: 'SF-001', dibuat: '17 Agu 2026 · 05:40', aktif: true },
  { id: 'FR-002', jenis: 'Ikan Tenggiri', berat: 85, asal: 'Pangkep', tujuan: 'Maros', kapal: 'KM Cahaya Laut', perangkat: 'SF-001', dibuat: '16 Agu 2026 · 05:15', aktif: false },
  { id: 'FR-001', jenis: 'Ikan Kerapu', berat: 120, asal: 'Pangkep', tujuan: 'Makassar', kapal: 'KM Cahaya Laut', perangkat: 'SF-001', dibuat: '15 Agu 2026 · 05:30', aktif: false },
]
let lastCreated: string | null = null
export type Tahap = 'masuk' | 'stok' | 'keluar'
export interface Distribusi {
  tahap: Tahap
  kualitas?: string
  waktu?: string
}

let distribusi: Record<string, Distribusi> = { 'FR-001': { tahap: 'stok', kualitas: 'Baik', waktu: 'Kemarin · 16:10' } }

const nowLabel = () => {
  const d = new Date()
  return `Hari ini · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const qrStore = {
  distribusi: () => distribusi,
  terima(id: string, kualitas: string) {
    distribusi = { ...distribusi, [id]: { tahap: 'stok', kualitas, waktu: nowLabel() } }
    emit()
  },
  keluarkan(id: string) {
    distribusi = { ...distribusi, [id]: { ...(distribusi[id] ?? { tahap: 'stok' }), tahap: 'keluar', waktu: nowLabel() } }
    emit()
  },
  subscribe: (l: () => void) => (listeners.add(l), () => listeners.delete(l)),
  get: () => items,
  activeBatch: () => items.find((b) => b.aktif),
  nextId: () => `FR-${String(items.length + 1).padStart(3, '0')}`,
  lastCreated: () => items.find((b) => b.id === lastCreated),
  create(b: Omit<QrBatchItem, 'id' | 'dibuat' | 'aktif'> & { tanggalBerangkat: string; distributor: string }) {
    const d = new Date()
    const dibuat = `Hari ini · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    const item: QrBatchItem = { nelayan: 'Ahmad Sulaiman', ...b, id: qrStore.nextId(), dibuat, aktif: true }
    items = [item, ...items.map((x) => ({ ...x, aktif: false }))]
    lastCreated = item.id
    emit()
    return item
  },
}

export function useQrBatches() {
  return useSyncExternalStore(qrStore.subscribe, qrStore.get)
}

export function useDistribusi() {
  return useSyncExternalStore(qrStore.subscribe, qrStore.distribusi)
}
