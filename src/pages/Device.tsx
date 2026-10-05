import { useState } from 'react'

interface DeviceInfo {
  id: string
  status: 'ONLINE' | 'OFFLINE'
  suhu: number
  gps: string
  baterai: number
  koneksi: string
  lastUpdate: string
  aktif: boolean
}

const initialDevices: DeviceInfo[] = [
  { id: 'SF-001', status: 'ONLINE', suhu: 2.8, gps: '-4.8672° S, 119.5314° E', baterai: 85, koneksi: '4G LTE', lastUpdate: '17:42:03', aktif: true },
  { id: 'SF-002', status: 'ONLINE', suhu: 5.7, gps: '-4.9100° S, 119.4800° E', baterai: 72, koneksi: '4G LTE', lastUpdate: '17:41:51', aktif: true },
  { id: 'SF-003', status: 'OFFLINE', suhu: 1.9, gps: '-5.0200° S, 119.4200° E', baterai: 31, koneksi: 'Tidak ada sinyal', lastUpdate: '16:55:00', aktif: false },
  { id: 'SF-004', status: 'ONLINE', suhu: 6.2, gps: '-4.7800° S, 119.5900° E', baterai: 60, koneksi: '3G', lastUpdate: '17:40:22', aktif: true },
]

export default function Device() {
  const [devices, setDevices] = useState(initialDevices)
  const [activating, setActivating] = useState<string | null>(null)

  const activate = (id: string) => {
    setActivating(id)
    setTimeout(() => {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, aktif: true, status: 'ONLINE' as const } : d))
      setActivating(null)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Smart-Frost Device</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Kelola dan pantau perangkat sensor IoT Anda.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Device', value: devices.length, color: '#06b6d4' },
          { label: 'Online', value: devices.filter(d => d.status === 'ONLINE').length, color: '#34d399' },
          { label: 'Offline', value: devices.filter(d => d.status === 'OFFLINE').length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border text-center" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: '#64a0c8' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Device list */}
      <div className="space-y-3">
        {devices.map((d) => (
          <div key={d.id} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-base" style={{ color: '#e8f4fd' }}>{d.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${d.status === 'ONLINE' ? 'badge-online' : 'badge-offline'}`}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block mr-1" style={{ background: d.status === 'ONLINE' ? '#34d399' : '#f87171' }} />
                    {d.status}
                  </span>
                </div>
              </div>
              {!d.aktif ? (
                <button
                  onClick={() => activate(d.id)}
                  disabled={activating === d.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#061220' }}
                >
                  {activating === d.id ? 'Mengaktifkan...' : '▶ Aktifkan Device'}
                </button>
              ) : (
                <span className="text-xs px-2 py-1 rounded badge-online">Aktif</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 lg:grid-cols-4">
              {[
                { label: 'Suhu', value: `${d.suhu}°C`, color: d.suhu > 5 ? '#f87171' : d.suhu > 4 ? '#fbbf24' : '#06b6d4' },
                { label: 'Baterai', value: `${d.baterai}%`, color: d.baterai < 30 ? '#f87171' : d.baterai < 60 ? '#fbbf24' : '#34d399' },
                { label: 'Koneksi', value: d.koneksi, color: d.status === 'ONLINE' ? '#34d399' : '#f87171' },
                { label: 'Update Terakhir', value: d.lastUpdate, color: '#64a0c8' },
              ].map(info => (
                <div key={info.label}>
                  <p className="text-xs" style={{ color: '#64a0c8' }}>{info.label}</p>
                  <p className="text-sm font-mono font-medium mt-0.5" style={{ color: info.color }}>{info.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(6,182,212,0.08)' }}>
              <p className="text-xs" style={{ color: '#64a0c8' }}>
                <span className="font-medium" style={{ color: '#e8f4fd' }}>GPS: </span>
                <span className="font-mono">{d.gps}</span>
                {d.status === 'ONLINE' && (
                  <span className="ml-2 badge-online text-xs px-1.5 py-0.5 rounded">ACTIVE</span>
                )}
              </p>
              {/* Battery bar */}
              <div className="mt-2">
                <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(6,182,212,0.1)' }}>
                  <div
                    className="rounded-full h-1.5 transition-all"
                    style={{
                      width: `${d.baterai}%`,
                      background: d.baterai < 30 ? '#f87171' : d.baterai < 60 ? '#fbbf24' : '#34d399',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
