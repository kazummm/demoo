import { useState } from 'react'
import { batches, getFrostScoreCategory } from '../data'
import { StatusBadge, getStatusFromSuhu } from '../components/Status'

const riwayat = [
  ...batches,
  {
    id: 'FR-000', jenis: 'Ikan Cakalang', berat: 200, asal: 'Pangkep', tujuan: 'Makassar',
    nelayan: 'Usman Dg. Nai', distributor: 'PT Segar Bahari', tanggal: '2026-08-15',
    kapal: 'KM Putra Mandiri', suhu: 2.2, frostScore: 96, status: 'AMAN' as const, deviceId: 'SF-005',
  },
]

const AKTIF_DATE = '2026-08-17'
type Filter = 'semua' | 'aktif' | 'selesai'

export default function Riwayat() {
  const [filter, setFilter] = useState<Filter>('semua')
  const rows = riwayat.filter((b) => filter === 'semua' || (filter === 'aktif') === (b.tanggal === AKTIF_DATE))
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Riwayat Pengiriman</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Semua batch pengiriman yang pernah tercatat.</p>
      </div>

      <div role="group" aria-label="Filter pengiriman" className="grid grid-cols-3 gap-1 rounded-lg p-1" style={{ background: 'rgba(0,31,63,0.7)', border: '1px solid rgba(232,244,253,0.2)' }}>
        {([['semua', 'Semua'], ['aktif', 'Aktif'], ['selesai', 'Selesai']] as [Filter, string][]).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className="min-h-12 rounded-md text-sm font-semibold"
            style={{ background: filter === k ? 'var(--primary)' : 'transparent', color: filter === k ? 'var(--primary-foreground)' : '#93c1e0' }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr style={{ background: '#0a1e38', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
              {['ID Batch', 'Jenis Ikan', 'Berat', 'Rute', 'Tanggal', 'Suhu', 'FrostScore', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64a0c8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => {
              const { color: scoreColor } = getFrostScoreCategory(b.frostScore)
              return (
                <tr key={b.id} style={{ background: i % 2 === 0 ? '#0d2040' : 'rgba(13,32,64,0.5)', borderBottom: '1px solid rgba(6,182,212,0.06)' }}>
                  <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: '#06b6d4' }}>{b.id}</td>
                  <td className="px-4 py-3" style={{ color: '#e8f4fd' }}>{b.jenis}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#64a0c8' }}>{b.berat} kg</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64a0c8' }}>{b.asal} → {b.tujuan}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#64a0c8' }}>{b.tanggal}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#06b6d4' }}>{b.suhu}°C</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: scoreColor }}>{b.frostScore}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getStatusFromSuhu(b.suhu)} size="sm" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
