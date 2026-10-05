import { visibleBatches } from '../session'
import { useState, useEffect } from 'react'
import { tempHistory, getStatusColor, type Role, type Status } from '../data'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { StatusBadge, STATUS_META, getStatusFromSuhu, SUB_TEXT } from '../components/Status'

export default function Monitoring({ role }: { role: Role }) {
  const isNelayan = role === 'nelayan'
  const isPemerintah = role === 'pemerintah'
  const [selectedBatch, setSelectedBatch] = useState('FR-001')
  const [showDetail, setShowDetail] = useState(false)
  const [history] = useState(tempHistory)
  const [aiMsg, setAiMsg] = useState<string | null>(null)
  const sub = SUB_TEXT

  useEffect(() => {
    const last = history.slice(-3).map(h => h.suhu)
    if (last.length === 3 && last[2] - last[0] > 1.5) {
      setAiMsg(`Kenaikan suhu ${(last[2] - last[0]).toFixed(1)}°C dalam 2 jam terakhir.`)
    } else {
      setAiMsg(null)
    }
  }, [history])

  const current = history[history.length - 1]
  const temps = history.map(h => h.suhu)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
  const status = getStatusFromSuhu(current.suhu)
  const meta = STATUS_META[status]

  const chartData = history.map(h => ({ ...h, fill: getStatusColor(getStatusFromSuhu(h.suhu)) }))

  const header = (
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Monitoring Cold Chain</h1>
        <p className="text-sm mt-0.5" style={{ color: sub }}>Pemantauan suhu realtime selama pengiriman.</p>
        {isPemerintah && <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--primary)' }}>Mode lihat saja · Data simulasi prototipe</p>}
      </div>
      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        aria-label="Pilih batch"
        className="rounded-lg px-3 text-sm outline-none"
        style={{ minHeight: 48, background: '#0d2040', border: '1px solid rgba(6,182,212,0.2)', color: '#e8f4fd' }}
      >
        {visibleBatches().map(b => (
          <option key={b.id} value={b.id}>{b.id} — {b.jenis}</option>
        ))}
      </select>
    </div>
  )

  const aiBanner = aiMsg && (
    <div className="rounded-xl p-3 border flex items-center gap-3 flex-wrap" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2v3M8 8h8a4 4 0 014 4v7H4v-7a4 4 0 014-4Z" /></svg>
      <p className="text-sm" style={{ color: '#fbbf24' }}>AI: {aiMsg}</p>
      <span className="ml-auto"><StatusBadge status={status} size="sm" /></span>
    </div>
  )

  const thresholds = [
    { range: '0 – 4°C', status: 'AMAN' as Status, desc: 'Kondisi ideal untuk ikan segar' },
    { range: '4 – 6°C', status: 'WASPADA' as Status, desc: 'Perhatikan kondisi pendinginan' },
    { range: '> 6°C', status: 'RISIKO' as Status, desc: 'Segera tangani — risiko kerusakan' },
  ]

  const technical = (
    <>
      {isNelayan && aiBanner}

      {isNelayan && <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Suhu Min', value: `${minTemp}°C`, color: '#34d399' },
          { label: 'Suhu Maks', value: `${maxTemp}°C`, color: '#f87171' },
          { label: 'Rata-rata', value: `${avgTemp}°C`, color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: sub }}>{s.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>}

      {isNelayan && (
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-xs mb-2" style={{ color: sub }}>Lokasi GPS</p>
          <p className="text-sm font-mono font-medium" style={{ color: '#34d399' }}>ACTIVE</p>
          <p className="text-xs mt-1 font-mono" style={{ color: sub }}>-4.8672° S, 119.5314° E</p>
        </div>
      )}

      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-sm font-semibold" style={{ color: '#e8f4fd' }}>Grafik Suhu vs Waktu</p>
          <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: sub }}>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: '#34d399' }} /> Aman (≤ 4°C)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: '#fbbf24' }} /> Waspada (4–6°C)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: '#f87171' }} /> Risiko ({">"} 6°C)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
            <XAxis dataKey="time" tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 7]} tick={{ fill: sub, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}°`} />
            <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 12 }} formatter={(v) => [`${v}°C`, 'Suhu']} />
            <ReferenceLine y={4} stroke="rgba(251,191,36,0.5)" strokeDasharray="4 4" label={{ value: '4°C', fill: '#fbbf24', fontSize: 10 }} />
            <ReferenceLine y={6} stroke="rgba(248,113,113,0.5)" strokeDasharray="4 4" label={{ value: '6°C', fill: '#f87171', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="suhu"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props
                const color = getStatusColor(getStatusFromSuhu(payload.suhu))
                return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill={color} stroke="#0d2040" strokeWidth={1.5} />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-xs font-medium mb-3" style={{ color: sub }}>BATAS SUHU AMAN</p>
        <div className="grid grid-cols-3 gap-3">
          {thresholds.map(item => (
            <div key={item.range} className="rounded-xl p-3 border" style={{ background: '#0d2040', borderColor: `${getStatusColor(item.status)}33` }}>
              <StatusBadge status={item.status} size="sm" />
              <p className="text-base font-bold font-mono mt-2" style={{ color: getStatusColor(item.status) }}>{item.range}</p>
              <p className="text-xs mt-1" style={{ color: sub }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  if (isNelayan) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4">
        {header}

        <section className="card space-y-4 p-5" aria-label="Kondisi saat ini">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm" style={{ color: SUB_TEXT }}>Suhu Saat Ini</p>
            <StatusBadge status={status} size="md" />
          </div>
          <p className="font-mono text-6xl font-bold leading-none" style={{ color: meta.color }}>{current.suhu}°C</p>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(232,244,253,0.15)' }}>
            <p className="text-sm" style={{ color: SUB_TEXT }}>Status Kondisi</p>
            <p className="text-lg font-bold" style={{ color: meta.color }}>{status} · {meta.microcopy}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-sm" style={{ color: SUB_TEXT }}>Lokasi</dt>
              <dd className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Selat Makassar</dd>
            </div>
            <div>
              <dt className="text-sm" style={{ color: SUB_TEXT }}>Durasi</dt>
              <dd className="font-mono text-base font-semibold" style={{ color: 'var(--foreground)' }}>11 jam</dd>
            </div>
          </dl>
        </section>

        <button
          type="button"
          onClick={() => setShowDetail(v => !v)}
          aria-expanded={showDetail}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
          style={{ color: 'var(--primary)', border: '1px solid var(--border)', background: 'rgba(10,30,56,0.6)' }}
        >
          Detail Teknis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: showDetail ? 'rotate(180deg)' : undefined }}>
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>

        {showDetail && <div className="space-y-4">{technical}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {header}

      {aiBanner}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Suhu Saat Ini', value: `${current.suhu}°C`, color: meta.color },
          { label: 'Suhu Min', value: `${minTemp}°C`, color: '#34d399' },
          { label: 'Suhu Maks', value: `${maxTemp}°C`, color: '#f87171' },
          { label: 'Suhu Rata-rata', value: `${avgTemp}°C`, color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: sub }}>{s.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-2 gap-3 ${isPemerintah ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-xs mb-2" style={{ color: sub }}>Status Kondisi</p>
          <StatusBadge status={status} size="md" />
          <p className="text-xs mt-2" style={{ color: sub }}>{meta.microcopy}</p>
        </div>
        {!isPemerintah && <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-xs mb-2" style={{ color: sub }}>Lokasi GPS</p>
          <p className="text-sm font-mono font-medium" style={{ color: '#34d399' }}>ACTIVE</p>
          <p className="text-xs mt-1 font-mono" style={{ color: sub }}>-4.8672° S, 119.5314° E</p>
          <p className="text-xs mt-0.5" style={{ color: sub }}>Selat Makassar</p>
        </div>}
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-xs mb-2" style={{ color: sub }}>Durasi Perjalanan</p>
          <p className="text-xl font-bold font-mono" style={{ color: '#e8f4fd' }}>11 jam</p>
          <p className="text-xs mt-1" style={{ color: sub }}>Estimasi tiba: 16:00 WIB</p>
        </div>
      </div>

      {technical}
    </div>
  )
}
