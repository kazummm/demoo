import { batches, getStatusColor } from '../data'
import { StatusBadge, getStatusFromSuhu } from '../components/Status'

// Simplified SVG map of Pangkep area with distribution routes
export default function PetaDistribusi() {
  // Simulated coordinates mapped to SVG space (600x400)
  const locations = {
    pangkep:     { x: 180, y: 200, label: 'Pangkep' },
    liukang:     { x: 320, y: 120, label: 'Liukang Tupabbiring' },
    mandalle:    { x: 130, y: 160, label: 'Mandalle' },
    segeri:      { x: 150, y: 240, label: 'Segeri' },
    pelabuhan:   { x: 220, y: 195, label: 'Pelabuhan Pangkajene' },
    selat:       { x: 360, y: 200, label: 'Selat Makassar' },
    makassar:    { x: 480, y: 300, label: 'Makassar' },
  }

  const routes = [
    { from: locations.pangkep, to: locations.pelabuhan, color: '#34d399' },
    { from: locations.pelabuhan, to: locations.selat, color: '#34d399' },
    { from: locations.selat, to: locations.makassar, color: '#34d399' },
    { from: locations.liukang, to: locations.selat, color: '#fbbf24' },
    { from: locations.selat, to: locations.makassar, color: '#fbbf24' },
    { from: locations.mandalle, to: locations.pelabuhan, color: '#34d399' },
    { from: locations.segeri, to: locations.pelabuhan, color: '#f87171' },
  ]

  const ships = [
    { x: 300, y: 200, batch: 'FR-001', color: '#34d399' },
    { x: 350, y: 155, batch: 'FR-002', color: '#fbbf24' },
    { x: 420, y: 270, batch: 'FR-003', color: '#34d399' },
    { x: 200, y: 235, batch: 'FR-004', color: '#f87171' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Peta Distribusi</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Jalur distribusi ikan antarpulau — Kabupaten Pangkep.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>DATA SIMULASI</span>
        {[
          { color: '#34d399', label: 'AMAN' },
          { color: '#fbbf24', label: 'WASPADA' },
          { color: '#f87171', label: 'RISIKO' },
        ].map(item => (
          <span key={item.label} className="flex items-center gap-1 text-xs" style={{ color: item.color }}>
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      {/* SVG Map */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#071828', borderColor: 'rgba(6,182,212,0.12)' }}>
        <svg width="100%" viewBox="0 0 600 400" style={{ minHeight: 300 }}>
          {/* Ocean background */}
          <rect width="600" height="400" fill="#071828"/>
          {/* Water texture */}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1="0" y1={20 * i} x2="600" y2={20 * i} stroke="rgba(6,182,212,0.04)" strokeWidth="1"/>
          ))}
          {/* Land mass (simplified Sulawesi/Pangkep coastline) */}
          <path
            d="M 0 150 Q 50 130 100 140 Q 130 120 140 100 L 160 80 Q 180 60 160 50 L 140 40 Q 100 30 80 50 Q 50 70 30 90 Q 10 110 0 130 Z"
            fill="rgba(15,52,96,0.6)"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1"
          />
          <path
            d="M 0 200 L 0 400 L 250 400 L 250 360 Q 220 350 200 320 Q 170 290 160 270 Q 140 250 120 240 Q 90 230 70 220 Q 40 210 0 200 Z"
            fill="rgba(15,52,96,0.6)"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1"
          />

          {/* Grid lines */}
          {[100, 200, 300, 400, 500].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="rgba(6,182,212,0.05)" strokeWidth="1"/>
          ))}
          {[100, 200, 300].map(y => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(6,182,212,0.05)" strokeWidth="1"/>
          ))}

          {/* Routes */}
          {routes.map((r, i) => (
            <line
              key={i}
              x1={r.from.x} y1={r.from.y}
              x2={r.to.x} y2={r.to.y}
              stroke={r.color}
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.5"
            />
          ))}

          {/* Location dots */}
          {Object.entries(locations).map(([key, loc]) => (
            <g key={key}>
              <circle cx={loc.x} cy={loc.y} r="5" fill="#0f3460" stroke="#06b6d4" strokeWidth="1.5"/>
              <circle cx={loc.x} cy={loc.y} r="2" fill="#06b6d4"/>
              <text x={loc.x + 7} y={loc.y + 4} fill="#64a0c8" fontSize="9" fontFamily="Outfit, sans-serif">{loc.label}</text>
            </g>
          ))}

          {/* Ship positions */}
          {ships.map((s) => (
            <g key={s.batch}>
              <circle cx={s.x} cy={s.y} r="10" fill={`${s.color}20`} stroke={s.color} strokeWidth="1.5">
                <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx={s.x} cy={s.y} r="4" fill={s.color}/>
              <text x={s.x} y={s.y - 14} fill={s.color} fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="600">{s.batch}</text>
            </g>
          ))}

          {/* Label */}
          <text x="10" y="390" fill="rgba(100,160,200,0.4)" fontSize="9" fontFamily="Outfit, sans-serif">DATA SIMULASI PROTOTYPE · SMART-FROST</text>
        </svg>
      </div>

      {/* Active shipments list */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>POSISI PENGIRIMAN AKTIF</p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {batches.map((b) => (
            <div key={b.id} className="rounded-xl p-3 border flex items-center gap-3" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${getStatusColor(b.status)}20`, border: `1.5px solid ${getStatusColor(b.status)}` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: getStatusColor(b.status) }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: '#06b6d4' }}>{b.id}</span>
                  <span className="text-xs" style={{ color: '#e8f4fd' }}>{b.jenis}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#64a0c8' }}>{b.asal} → {b.tujuan}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono" style={{ color: getStatusColor(b.status) }}>{b.suhu}°C</p>
                <StatusBadge status={getStatusFromSuhu(b.suhu)} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
