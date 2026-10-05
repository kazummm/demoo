import { useState } from 'react'
import { batches, getFrostScoreCategory, type Role } from '../data'
import { session } from '../session'

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

export default function Riwayat({ role }: { role: Role }) {
  const [filter, setFilter] = useState<Filter>('semua')
  const isPemerintah = role === 'pemerintah'
  const rows = riwayat.filter((b) => session.role() !== 'distributor' || b.distributor === session.name()).filter((b) => filter === 'semua' || (filter === 'aktif') === (b.tanggal === AKTIF_DATE))
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Riwayat Pengiriman</h1>
        <p className="text-sm mt-0.5" style={{ color: isPemerintah ? 'var(--muted-foreground)' : '#64a0c8' }}>Semua batch pengiriman yang pernah tercatat.</p>
        {isPemerintah && <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--primary)' }}>Mode lihat saja · Data simulasi prototipe · Data pribadi disamarkan</p>}
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

      {isPemerintah && <ul className="space-y-3 md:hidden">
        {rows.map((b) => {
          const { color } = getFrostScoreCategory(b.frostScore)
          return (
            <li key={b.id} className="rounded-xl p-4" style={{ background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-bold" style={{ color: 'var(--primary)' }}>{b.id}</p>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{b.jenis} · {b.berat} kg</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{b.asal} → {b.tujuan} · {b.tanggal}</p>
                </div>
                <StatusBadge status={getStatusFromSuhu(b.suhu)} size="sm" />
              </div>
              <div className="mt-3 flex gap-4 font-mono text-sm">
                <span style={{ color: 'var(--primary)' }}>{b.suhu}°C</span>
                <span style={{ color }}>FrostScore {b.frostScore}</span>
              </div>
            </li>
          )
        })}
      </ul>}
      <div className={`${isPemerintah ? 'hidden md:block' : ''} rounded-xl border overflow-x-auto`} style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr style={{ background: '#0a1e38', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
              {['ID Batch', 'Jenis Ikan', 'Berat', 'Rute', 'Tanggal', 'Suhu', 'FrostScore', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-sm font-medium" style={{ color: isPemerintah ? 'var(--muted-foreground)' : '#64a0c8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => {
              const { color: scoreColor } = getFrostScoreCategory(b.frostScore)
              return (
                <tr key={b.id} style={{ background: i % 2 === 0 ? '#0d2040' : 'rgba(13,32,64,0.5)', borderBottom: '1px solid rgba(6,182,212,0.06)' }}>
                  <td className="px-4 py-3 font-mono font-bold text-sm" style={{ color: '#06b6d4' }}>{b.id}</td>
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
