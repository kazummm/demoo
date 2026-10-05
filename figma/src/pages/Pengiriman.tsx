import { batches, shipmentStages, getFrostScoreCategory } from '../data'
import { StatusBadge, getStatusFromSuhu } from '../components/Status'

export default function Pengiriman() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Pengiriman</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Pantau alur pengiriman batch dari nelayan ke konsumen.</p>
      </div>

      {/* Alur visual */}
      <div className="rounded-xl p-5 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <p className="text-xs font-medium mb-4" style={{ color: '#64a0c8' }}>ALUR RANTAI DISTRIBUSI</p>
        <div className="flex items-center gap-1 flex-wrap">
          {shipmentStages.map((stage, i) => (
            <div key={stage.name} className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{
                    background: stage.done ? 'rgba(16,185,129,0.15)' : 'rgba(6,182,212,0.05)',
                    borderColor: stage.done ? '#34d399' : 'rgba(6,182,212,0.2)',
                    color: stage.done ? '#34d399' : '#64a0c8',
                  }}
                >
                  {stage.done ? '✓' : i + 1}
                </div>
                <p className="text-xs mt-1 text-center max-w-16" style={{ color: stage.done ? '#e8f4fd' : '#64a0c8', fontSize: '9px' }}>{stage.name}</p>
              </div>
              {i < shipmentStages.length - 1 && (
                <div className="w-5 h-px mb-5" style={{ background: stage.done ? '#34d399' : 'rgba(6,182,212,0.15)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Batch list */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>SEMUA PENGIRIMAN</p>
        <div className="space-y-3">
          {batches.map((b) => {
            const { color: scoreColor, label: scoreLabel } = getFrostScoreCategory(b.frostScore)
            // Determine current stage
            const currentStage = b.id === 'FR-001' ? 'Kapal' : b.id === 'FR-002' ? 'Pelabuhan' : b.id === 'FR-003' ? 'Distributor' : 'Transportasi'
            return (
              <div key={b.id} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm" style={{ color: '#06b6d4' }}>{b.id}</span>
                      <StatusBadge status={getStatusFromSuhu(b.suhu)} size="sm" />
                    </div>
                    <p className="text-sm" style={{ color: '#e8f4fd' }}>{b.jenis} · {b.berat} kg</p>
                    <p className="text-xs mt-1" style={{ color: '#64a0c8' }}>
                      <span>{b.asal}</span>
                      <span className="mx-1.5">→</span>
                      <span>{b.tujuan}</span>
                      <span className="mx-1.5">·</span>
                      <span>{b.kapal}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold" style={{ color: '#06b6d4' }}>{b.suhu}°C</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: scoreColor }}>FS: {b.frostScore}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64a0c8' }}>{scoreLabel}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 flex items-center justify-between flex-wrap gap-2" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64a0c8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                    <span className="text-xs" style={{ color: '#64a0c8' }}>Tahap saat ini:</span>
                    <span className="text-xs font-medium" style={{ color: '#06b6d4' }}>{currentStage}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#64a0c8' }}>{b.tanggal}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage details for FR-001 */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>DETAIL TAHAP — FR-001</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0a1e38', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
                {['Tahap', 'Waktu', 'Lokasi', 'Suhu', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium" style={{ color: '#64a0c8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shipmentStages.map((s, i) => (
                <tr key={s.name} style={{ background: i % 2 === 0 ? '#0d2040' : 'rgba(13,32,64,0.5)', borderBottom: '1px solid rgba(6,182,212,0.06)', opacity: s.done ? 1 : 0.5 }}>
                  <td className="px-4 py-2.5" style={{ color: '#e8f4fd' }}>{s.name}</td>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{ color: '#64a0c8' }}>{s.done ? s.time : '—'}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: '#64a0c8' }}>{s.done ? s.lokasi : '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{ color: '#06b6d4' }}>{s.done ? `${s.suhu}°C` : '—'}</td>
                  <td className="px-4 py-2.5">
                    {s.done
                      ? <StatusBadge status={getStatusFromSuhu(s.suhu)} size="sm" />
                      : <span className="text-xs" style={{ color: '#64a0c8' }}>Menunggu</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
