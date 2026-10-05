import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import type { Status } from '../data'
import { StatusBadge, getStatusFromSuhu } from '../components/Status'

type SimMode = 'NORMAL' | 'WASPADA' | 'RISIKO'

function getTempRange(mode: SimMode): [number, number] {
  if (mode === 'NORMAL') return [2.0, 4.0]
  if (mode === 'WASPADA') return [4.1, 6.0]
  return [6.1, 8.0]
}

function randomInRange(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(1)
}

const getStatus = getStatusFromSuhu

interface DataPoint {
  t: string
  suhu: number
  status: Status
}

export default function Simulasi() {
  const [mode, setMode] = useState<SimMode>('NORMAL')
  const [running, setRunning] = useState(false)
  const [data, setData] = useState<DataPoint[]>([])
  const [connection, setConnection] = useState<'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED'>('ONLINE')
  const [aiMsg, setAiMsg] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countRef = useRef(0)

  const start = () => {
    setRunning(true)
    setData([])
    countRef.current = 0
    setAiMsg(null)
  }

  const stop = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      countRef.current++
      const [min, max] = getTempRange(mode)
      const suhu = randomInRange(min, max)
      const status = getStatus(suhu)
      const now = new Date()
      const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`

      setData(prev => {
        const next = [...prev.slice(-19), { t, suhu, status }]
        // Anomaly detection
        if (next.length >= 3) {
          const last3 = next.slice(-3).map(d => d.suhu)
          if (last3[2] - last3[0] > 1.2) {
            setAiMsg(`Anomali: kenaikan ${(last3[2] - last3[0]).toFixed(1)}°C terdeteksi.`)
          } else {
            setAiMsg(null)
          }
        }
        return next
      })

      // Simulate offline every ~20 ticks
      if (countRef.current % 20 === 0) {
        setConnection('OFFLINE')
        setTimeout(() => {
          setConnection('SYNCING')
          setTimeout(() => setConnection('SYNCED'), 1500)
          setTimeout(() => setConnection('ONLINE'), 3000)
        }, 2000)
      }
    }, 1200)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const current = data[data.length - 1]
  const connColors: Record<string, string> = { ONLINE: '#34d399', OFFLINE: '#f87171', SYNCING: '#fbbf24', SYNCED: '#60a5fa' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Simulasi Sensor</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Simulasikan data sensor IoT secara realtime.</p>
      </div>

      {/* Controls */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <p className="text-xs mb-1.5" style={{ color: '#64a0c8' }}>Mode Kondisi</p>
            <div className="flex gap-2">
              {(['NORMAL', 'WASPADA', 'RISIKO'] as SimMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); if (running) { stop(); setTimeout(start, 50) } }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: mode === m
                      ? m === 'NORMAL' ? 'rgba(52,211,153,0.15)' : m === 'WASPADA' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)'
                      : 'rgba(6,182,212,0.05)',
                    color: mode === m
                      ? m === 'NORMAL' ? '#34d399' : m === 'WASPADA' ? '#fbbf24' : '#f87171'
                      : '#64a0c8',
                    border: `1px solid ${mode === m
                      ? m === 'NORMAL' ? 'rgba(52,211,153,0.3)' : m === 'WASPADA' ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'
                      : 'rgba(6,182,212,0.1)'}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs" style={{ color: '#64a0c8' }}>Koneksi</p>
              <span className="flex items-center gap-1 text-xs font-mono font-medium" style={{ color: connColors[connection] }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: connColors[connection] }} />
                {connection}
              </span>
            </div>
            {!running ? (
              <button
                onClick={start}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#061220' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                Mulai Simulasi
              </button>
            ) : (
              <button
                onClick={stop}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                Hentikan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI anomaly */}
      {aiMsg && (
        <div className="rounded-xl p-3 border flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <span className="text-lg">🤖</span>
          <p className="text-sm" style={{ color: '#fbbf24' }}>AI: {aiMsg}</p>
        </div>
      )}

      {/* Current reading */}
      {current && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: '#64a0c8' }}>Suhu Saat Ini</p>
            <p className="text-3xl font-bold font-mono" style={{ color: current.suhu > 5 ? '#f87171' : current.suhu > 4 ? '#fbbf24' : '#06b6d4' }}>
              {current.suhu}°C
            </p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: '#64a0c8' }}>Status</p>
            <StatusBadge status={current.status} />
          </div>
          <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: '#64a0c8' }}>GPS</p>
            <p className="text-sm font-mono" style={{ color: '#34d399' }}>ACTIVE</p>
            <p className="text-xs mt-1 font-mono" style={{ color: '#64a0c8' }}>{current.t}</p>
          </div>
        </div>
      )}

      {/* Live chart */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm font-semibold" style={{ color: '#e8f4fd' }}>Data Sensor Realtime</p>
          {running && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"/>}
        </div>
        {data.length === 0 ? (
          <div className="h-40 flex items-center justify-center" style={{ color: '#64a0c8' }}>
            <p className="text-sm">Tekan "Mulai Simulasi" untuk memulai...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)"/>
              <XAxis dataKey="t" tick={{ fill: '#64a0c8', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
              <YAxis domain={[0, 8]} tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}°`}/>
              <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 11 }} formatter={(v) => [`${v}°C`, 'Suhu']}/>
              <ReferenceLine y={4} stroke="rgba(251,191,36,0.3)" strokeDasharray="4 4"/>
              <ReferenceLine y={5} stroke="rgba(248,113,113,0.3)" strokeDasharray="4 4"/>
              <Line type="monotone" dataKey="suhu" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false}/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Connection log */}
      <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>SIKLUS KONEKSI</p>
        <div className="flex items-center gap-3 flex-wrap">
          {(['ONLINE', '→', 'OFFLINE', '→', 'SYNCING', '→', 'SYNCED', '→', 'ONLINE'] as string[]).map((s, i) => (
            s === '→'
              ? <span key={i} style={{ color: '#64a0c8' }}>→</span>
              : <span key={i} className="text-xs px-2 py-1 rounded font-mono" style={{
                  background: s === connection ? `${connColors[s]}20` : 'rgba(6,182,212,0.05)',
                  color: s === connection ? connColors[s] : '#64a0c8',
                  border: `1px solid ${s === connection ? `${connColors[s]}40` : 'rgba(6,182,212,0.1)'}`,
                  fontWeight: s === connection ? 700 : 400,
                }}>
                  {s}
                </span>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#64a0c8' }}>
          Saat OFFLINE, data disimpan sementara. Saat ONLINE kembali, data akan tersinkronisasi otomatis.
        </p>
      </div>
    </div>
  )
}
