import { govStats, batches } from '../data'
import { StatusBadge, getStatusFromSuhu } from '../components/Status'

export default function Laporan() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Laporan</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Ringkasan laporan distribusi ikan Kabupaten Pangkep.</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}>
          ↓ Unduh PDF
        </button>
      </div>

      <div className="rounded-xl p-5 border space-y-4" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold" style={{ color: '#e8f4fd' }}>Laporan Distribusi Ikan Antarpulau</p>
            <p className="text-xs mt-0.5" style={{ color: '#64a0c8' }}>Kabupaten Pangkep — Agustus 2026</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#64a0c8' }}>Diterbitkan oleh</p>
            <p className="text-xs font-medium" style={{ color: '#e8f4fd' }}>Dinas Kelautan Pangkep</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(6,182,212,0.1)', paddingTop: 16 }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>RINGKASAN EKSEKUTIF</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              ['Total Pengiriman', govStats.total],
              ['Pengiriman Selesai', govStats.selesai],
              ['Pengiriman Aktif', govStats.aktif],
              ['Rata-rata FrostScore', govStats.rataRataFrostScore],
              ['Total Peringatan', govStats.totalPeringatan],
              ['Avg Durasi (jam)', govStats.rataRataDurasi],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg p-3" style={{ background: '#061220' }}>
                <p className="text-xs" style={{ color: '#64a0c8' }}>{k}</p>
                <p className="text-lg font-bold font-mono mt-0.5" style={{ color: '#06b6d4' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(6,182,212,0.1)', paddingTop: 16 }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>DATA BATCH PERIODE INI</p>
          {batches.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(6,182,212,0.06)' }}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold" style={{ color: '#06b6d4' }}>{b.id}</span>
                <span className="text-sm" style={{ color: '#e8f4fd' }}>{b.jenis} · {b.berat}kg</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs" style={{ color: '#64a0c8' }}>{b.suhu}°C</span>
                <span className="font-mono text-xs" style={{ color: '#60a5fa' }}>FS: {b.frostScore}</span>
                <StatusBadge status={getStatusFromSuhu(b.suhu)} size="sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs" style={{ color: '#2d5a7a' }}>
          DATA SIMULASI PROTOTYPE · SMART-FROST v1.0 · GEMASTIK 2026
        </div>
      </div>
    </div>
  )
}
