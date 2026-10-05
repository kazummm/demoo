export type Role = 'nelayan' | 'distributor' | 'pemerintah'
export type Status = 'AMAN' | 'WASPADA' | 'RISIKO'
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED'

export interface Batch {
  id: string
  jenis: string
  berat: number
  asal: string
  tujuan: string
  nelayan: string
  distributor: string
  tanggal: string
  kapal: string
  suhu: number
  frostScore: number
  status: Status
  deviceId: string
}

export interface TempReading {
  time: string
  suhu: number
  status: Status
}

export interface ShipmentStage {
  name: string
  time: string
  lokasi: string
  suhu: number
  status: Status
  done: boolean
}

export const demoAccounts = [
  { email: 'nelayan@smartfrost.id', password: 'demo123', role: 'nelayan' as Role, name: 'Pak Ahmad Sulaiman' },
  { email: 'distributor@smartfrost.id', password: 'demo123', role: 'distributor' as Role, name: 'PT Segar Bahari' },
  { email: 'pemerintah@smartfrost.id', password: 'demo123', role: 'pemerintah' as Role, name: 'Dinas Kelautan Pangkep' },
]

export const batches: Batch[] = [
  {
    id: 'FR-001',
    jenis: 'Ikan Kerapu',
    berat: 120,
    asal: 'Pangkep',
    tujuan: 'Makassar',
    nelayan: 'Ahmad Sulaiman',
    distributor: 'PT Segar Bahari',
    tanggal: '2026-08-17',
    kapal: 'KM Cahaya Laut',
    suhu: 2.8,
    frostScore: 92,
    status: 'AMAN',
    deviceId: 'SF-001',
  },
  {
    id: 'FR-002',
    jenis: 'Ikan Tenggiri',
    berat: 150,
    asal: 'Liukang Tupabbiring',
    tujuan: 'Makassar',
    nelayan: 'Budi Santoso',
    distributor: 'PT Segar Bahari',
    tanggal: '2026-08-17',
    kapal: 'KM Barakuda',
    suhu: 5.7,
    frostScore: 68,
    status: 'WASPADA',
    deviceId: 'SF-002',
  },
  {
    id: 'FR-003',
    jenis: 'Udang Vannamei',
    berat: 80,
    asal: 'Mandalle',
    tujuan: 'Makassar',
    nelayan: 'Hasan Ibrahim',
    distributor: 'UD Maju Jaya',
    tanggal: '2026-08-16',
    kapal: 'KM Nelayan Jaya',
    suhu: 1.9,
    frostScore: 97,
    status: 'AMAN',
    deviceId: 'SF-003',
  },
  {
    id: 'FR-004',
    jenis: 'Ikan Baronang',
    berat: 60,
    asal: 'Segeri',
    tujuan: 'Makassar',
    nelayan: 'Ramli Kasim',
    distributor: 'PT Segar Bahari',
    tanggal: '2026-08-15',
    kapal: 'KM Sumber Rezeki',
    suhu: 6.2,
    frostScore: 54,
    status: 'RISIKO',
    deviceId: 'SF-004',
  },
]

export const tempHistory: TempReading[] = [
  { time: '06:00', suhu: 1.8, status: 'AMAN' },
  { time: '07:00', suhu: 2.1, status: 'AMAN' },
  { time: '08:00', suhu: 2.4, status: 'AMAN' },
  { time: '09:00', suhu: 2.8, status: 'AMAN' },
  { time: '10:00', suhu: 3.1, status: 'AMAN' },
  { time: '11:00', suhu: 3.4, status: 'AMAN' },
  { time: '12:00', suhu: 3.7, status: 'AMAN' },
  { time: '13:00', suhu: 4.2, status: 'WASPADA' },
  { time: '14:00', suhu: 4.8, status: 'WASPADA' },
  { time: '15:00', suhu: 3.9, status: 'AMAN' },
  { time: '16:00', suhu: 3.2, status: 'AMAN' },
  { time: '17:00', suhu: 2.8, status: 'AMAN' },
]

export const shipmentStages: ShipmentStage[] = [
  { name: 'Nelayan', time: '06:00', lokasi: 'Pangkep', suhu: 1.8, status: 'AMAN', done: true },
  { name: 'Penyimpanan', time: '07:30', lokasi: 'Cold Storage Pangkep', suhu: 2.0, status: 'AMAN', done: true },
  { name: 'Transportasi', time: '09:00', lokasi: 'Jl. Trans Sulawesi', suhu: 2.8, status: 'AMAN', done: true },
  { name: 'Pelabuhan', time: '10:30', lokasi: 'Pelabuhan Pangkajene', suhu: 3.1, status: 'AMAN', done: true },
  { name: 'Kapal', time: '12:00', lokasi: 'KM Cahaya Laut', suhu: 3.4, status: 'AMAN', done: true },
  { name: 'Pelabuhan Tujuan', time: '16:00', lokasi: 'Pelabuhan Soekarno-Hatta', suhu: 2.9, status: 'AMAN', done: false },
  { name: 'Distributor', time: '17:30', lokasi: 'Gudang PT Segar Bahari', suhu: 2.5, status: 'AMAN', done: false },
  { name: 'Konsumen', time: '19:00', lokasi: 'Makassar', suhu: 2.2, status: 'AMAN', done: false },
]

export const govStats = {
  total: 120,
  aktif: 15,
  selesai: 98,
  waspada: 5,
  risiko: 2,
  rataRataSuhu: 2.9,
  rataRataFrostScore: 84,
  totalPeringatan: 23,
  rataRataDurasi: 8.4,
}

export const frostScoreHistory = [
  { bulan: 'Mar', score: 78 },
  { bulan: 'Apr', score: 82 },
  { bulan: 'Mei', score: 80 },
  { bulan: 'Jun', score: 85 },
  { bulan: 'Jul', score: 88 },
  { bulan: 'Agu', score: 84 },
]

export const monthlyShipments = [
  { bulan: 'Mar', total: 18, aman: 14, waspada: 3, risiko: 1 },
  { bulan: 'Apr', total: 22, aman: 18, waspada: 3, risiko: 1 },
  { bulan: 'Mei', total: 19, aman: 15, waspada: 3, risiko: 1 },
  { bulan: 'Jun', total: 25, aman: 20, waspada: 4, risiko: 1 },
  { bulan: 'Jul', total: 21, aman: 17, waspada: 3, risiko: 1 },
  { bulan: 'Agu', total: 15, aman: 11, waspada: 2, risiko: 2 },
]

export const alerts = [
  {
    id: 1,
    batch: 'FR-002',
    suhu: 5.7,
    waktu: '14:32',
    tanggal: '2026-08-17',
    status: 'WASPADA' as Status,
    pesan: 'Suhu melewati batas 5°C. Periksa kondisi pendinginan.',
    lokasi: 'Selat Makassar',
  },
  {
    id: 2,
    batch: 'FR-004',
    suhu: 6.2,
    waktu: '11:15',
    tanggal: '2026-08-17',
    status: 'RISIKO' as Status,
    pesan: 'Suhu berada di atas batas aman. Segera tangani kondisi pendinginan.',
    lokasi: 'Pelabuhan Pangkajene',
  },
  {
    id: 3,
    batch: 'FR-001',
    suhu: 4.2,
    waktu: '13:00',
    tanggal: '2026-08-17',
    status: 'WASPADA' as Status,
    pesan: 'Anomali suhu terdeteksi. Kenaikan bertahap dari 3.4°C ke 4.2°C.',
    lokasi: 'KM Cahaya Laut',
  },
]

export function getStatusColor(status: Status): string {
  if (status === 'AMAN') return '#34d399'
  if (status === 'WASPADA') return '#fbbf24'
  return '#f87171'
}

export function getStatusBadgeClass(status: Status): string {
  if (status === 'AMAN') return 'badge-aman'
  if (status === 'WASPADA') return 'badge-waspada'
  return 'badge-risiko'
}

export function getFrostScoreCategory(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Sangat Baik', color: '#34d399' }
  if (score >= 75) return { label: 'Baik', color: '#60a5fa' }
  if (score >= 60) return { label: 'Waspada', color: '#fbbf24' }
  return { label: 'Risiko', color: '#f87171' }
}
