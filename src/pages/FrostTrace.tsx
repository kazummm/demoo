import { useState } from 'react'
import { shipmentStages, type Role } from '../data'
import { visibleBatches } from '../session'

import { StatusBadge, getStatusFromSuhu } from '../components/Status'
import FrostTraceTimeline from '../components/FrostTraceTimeline'

export default function FrostTrace({ role }: { role: Role }) {
  const [selectedBatch, setSelectedBatch] = useState('FR-001')
  const [showQR, setShowQR] = useState(false)
  const list = visibleBatches()
  const batch = list.find(b => b.id === selectedBatch) || list[0]

  if (role === 'pemerintah') {
    return (
      <div className="space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>FrostTrace</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Jejak perjalanan batch dalam mode lihat saja.</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--primary)' }}>Data simulasi prototipe · Identitas nelayan dan kapal disamarkan</p>
          </div>
          <select value={selectedBatch} onChange={(event) => setSelectedBatch(event.target.value)} className="input-field min-h-12 max-w-xs" aria-label="Pilih batch">
            {list.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.jenis}</option>)}
          </select>
        </header>
        <section className="rounded-xl p-4" style={{ background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Batch ID</p>
              <p className="font-mono text-xl font-bold" style={{ color: 'var(--primary)' }}>{batch.id}</p>
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>{batch.jenis} · {batch.berat} kg · {batch.asal} → {batch.tujuan}</p>
            </div>
            <StatusBadge status={getStatusFromSuhu(batch.suhu)} />
          </div>
        </section>
        <section className="rounded-xl p-4" style={{ background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }}>
          <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--foreground)' }}>Riwayat Perjalanan</h2>
          <FrostTraceTimeline batchId={batch.id} accent="#06b6d4" privacy />
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>FrostTrace</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Riwayat lengkap perjalanan setiap batch.</p>
        </div>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none"
          style={{ background: '#0d2040', border: '1px solid rgba(6,182,212,0.2)', color: '#e8f4fd' }}
        >
          {list.map(b => (
            <option key={b.id} value={b.id}>{b.id} — {b.jenis}</option>
          ))}
        </select>
      </div>

      {/* Batch info */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.2)' }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs" style={{ color: '#64a0c8' }}>Batch ID</p>
            <p className="text-xl font-bold font-mono" style={{ color: '#06b6d4' }}>{batch.id}</p>
            <p className="text-sm mt-1" style={{ color: '#e8f4fd' }}>{batch.jenis} · {batch.berat} kg</p>
            <p className="text-xs mt-1" style={{ color: '#64a0c8' }}>{batch.asal} → {batch.tujuan} · {batch.tanggal}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={getStatusFromSuhu(batch.suhu)} />
            <button
              onClick={() => setShowQR(!showQR)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              {showQR ? 'Tutup QR' : 'Tampilkan QR'}
            </button>
          </div>
        </div>

        {showQR && (
          <div className="mt-4 pt-4 flex items-center gap-4" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
            {/* QR code SVG simulation */}
            <svg width="80" height="80" viewBox="0 0 80 80">
              <rect width="80" height="80" fill="#0a1e38" rx="4"/>
              {/* Finder patterns */}
              <rect x="4" y="4" width="22" height="22" rx="2" fill="none" stroke="#06b6d4" strokeWidth="2"/>
              <rect x="8" y="8" width="14" height="14" rx="1" fill="#06b6d4"/>
              <rect x="54" y="4" width="22" height="22" rx="2" fill="none" stroke="#06b6d4" strokeWidth="2"/>
              <rect x="58" y="8" width="14" height="14" rx="1" fill="#06b6d4"/>
              <rect x="4" y="54" width="22" height="22" rx="2" fill="none" stroke="#06b6d4" strokeWidth="2"/>
              <rect x="8" y="58" width="14" height="14" rx="1" fill="#06b6d4"/>
              {/* Data modules */}
              {[32,36,40,44,48,52,32,40,48,34,38,42,46,50,32,36,44,52,36,40,48,34,42,50,38,46].map((x, i) => (
                <rect key={i} x={x} y={30 + (i % 7) * 6} width="4" height="4" fill="#06b6d4" opacity={0.6 + (i % 3) * 0.2}/>
              ))}
            </svg>
            <div>
              <p className="text-sm font-medium" style={{ color: '#e8f4fd' }}>QR Code Batch {batch.id}</p>
              <p className="text-xs mt-1" style={{ color: '#64a0c8' }}>Scan untuk melihat informasi lengkap batch ini.</p>
              <p className="text-xs font-mono mt-1" style={{ color: '#06b6d4' }}>smartfrost.id/trace/{batch.id.toLowerCase()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div>
        <p className="text-xs font-medium mb-4" style={{ color: '#64a0c8' }}>RIWAYAT PERJALANAN</p>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(6,182,212,0.15)' }} />

          <div className="space-y-2">
            {shipmentStages.map((stage, i) => (
              <div key={stage.name} className="relative pl-10">
                {/* Circle */}
                <div
                  className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: stage.done ? 'rgba(16,185,129,0.15)' : '#0a1e38',
                    borderColor: stage.done ? '#34d399' : 'rgba(6,182,212,0.2)',
                    color: stage.done ? '#34d399' : '#64a0c8',
                    zIndex: 1,
                  }}
                >
                  {stage.done ? '✓' : (i + 1)}
                </div>

                <div className="rounded-xl p-3 border" style={{
                  background: stage.done ? '#0d2040' : 'rgba(13,32,64,0.5)',
                  borderColor: stage.done ? 'rgba(52,211,153,0.15)' : 'rgba(6,182,212,0.08)',
                  opacity: stage.done ? 1 : 0.7,
                }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: stage.done ? '#e8f4fd' : '#64a0c8' }}>{stage.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#64a0c8' }}>{stage.lokasi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono" style={{ color: '#06b6d4' }}>{stage.suhu}°C</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: '#64a0c8' }}>{stage.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={getStatusFromSuhu(stage.suhu)} size="sm" />
                    {!stage.done && (
                      <span className="text-xs" style={{ color: '#64a0c8' }}>Belum tercapai</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
