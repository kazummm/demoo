import { getFrostScoreCategory } from '../data'
import { visibleBatches } from '../session'

import { StatusBadge, getStatusFromSuhu } from '../components/Status'

function GaugeArc({ score }: { score: number }) {
  const { color, label } = getFrostScoreCategory(score)
  const pct = score / 100
  // Half-circle arc: from 180° to 0°, sweep = pct * 180°
  const r = 70
  const cx = 90
  const cy = 90
  const startAngle = Math.PI
  const endAngle = Math.PI - pct * Math.PI
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = pct > 0.5 ? 0 : 1

  return (
    <svg width="180" height="100" viewBox="0 0 180 100">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(6,182,212,0.1)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Fill */}
      {score > 0 && (
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}
      {/* Score text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="28" fontWeight="700" fontFamily="JetBrains Mono, monospace">{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={color} fontSize="11" fontWeight="600" fontFamily="Outfit, sans-serif">{label.toUpperCase()}</text>
    </svg>
  )
}

export default function FrostScore() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>FrostScore</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Indikator kondisi rantai dingin selama perjalanan.</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { range: '90–100', label: 'Sangat Baik', color: '#34d399' },
          { range: '75–89', label: 'Baik', color: '#60a5fa' },
          { range: '60–74', label: 'Waspada', color: '#fbbf24' },
          { range: '0–59', label: 'Risiko', color: '#f87171' },
        ].map(c => (
          <div key={c.range} className="rounded-xl p-3 border text-center" style={{ background: '#0d2040', borderColor: `${c.color}30` }}>
            <p className="text-lg font-bold font-mono" style={{ color: c.color }}>{c.range}</p>
            <p className="text-xs mt-1" style={{ color: c.color }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Per-batch gauges */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleBatches().map((b) => {
          const { label, color } = getFrostScoreCategory(b.frostScore)
          return (
            <div key={b.id} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-mono font-bold text-sm" style={{ color: '#06b6d4' }}>{b.id}</span>
                  <span className="ml-2 text-sm" style={{ color: '#e8f4fd' }}>{b.jenis}</span>
                </div>
                <span className="text-xs" style={{ color: '#64a0c8' }}>{b.suhu}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <GaugeArc score={b.frostScore} />
                </div>
                <div className="flex-1 space-y-2 pl-2">
                  <div>
                    <p className="text-xs" style={{ color: '#64a0c8' }}>Kestabilan suhu</p>
                    <div className="w-full rounded-full h-1.5 mt-1" style={{ background: 'rgba(6,182,212,0.1)' }}>
                      <div className="rounded-full h-1.5" style={{ width: `${b.frostScore}%`, background: color }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#64a0c8' }}>Jumlah peringatan</p>
                    <p className="text-xs font-mono font-medium mt-0.5" style={{ color: '#e8f4fd' }}>
                      {getStatusFromSuhu(b.suhu) === 'AMAN' ? '0' : getStatusFromSuhu(b.suhu) === 'WASPADA' ? '2' : '4'} kali
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#64a0c8' }}>Durasi di luar batas</p>
                    <p className="text-xs font-mono font-medium mt-0.5" style={{ color: '#e8f4fd' }}>
                      {getStatusFromSuhu(b.suhu) === 'AMAN' ? '0 menit' : getStatusFromSuhu(b.suhu) === 'WASPADA' ? '45 menit' : '2 jam 10 menit'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
                <p className="text-xs" style={{ color: '#64a0c8' }}>
                  Skor: <span className="font-mono font-bold" style={{ color }}>{b.frostScore}</span>
                  <span className="ml-1" style={{ color }}>{label}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}>
        <p className="text-xs" style={{ color: '#64a0c8' }}>Indikator kondisi rantai dingin selama perjalanan. FrostScore dihitung berdasarkan kestabilan suhu, lama perjalanan, durasi suhu di luar batas, dan jumlah peringatan.</p>
      </div>
    </div>
  )
}
