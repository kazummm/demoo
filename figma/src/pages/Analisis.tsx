import { govStats, tempHistory, frostScoreHistory, monthlyShipments } from '../data'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

export default function Analisis() {
  const riskData = [
    { name: 'AMAN', value: 98, color: '#34d399' },
    { name: 'WASPADA', value: 5, color: '#fbbf24' },
    { name: 'RISIKO', value: 2, color: '#f87171' },
  ]

  const problemLocations = [
    { lokasi: 'Selat Makassar', kejadian: 8, suhuRata: 4.2 },
    { lokasi: 'Pelabuhan Pangkajene', kejadian: 6, suhuRata: 5.1 },
    { lokasi: 'Liukang Tupabbiring', kejadian: 4, suhuRata: 3.8 },
    { lokasi: 'Rute Darat Pangkep', kejadian: 3, suhuRata: 4.5 },
    { lokasi: 'Cold Storage Pangkep', kejadian: 2, suhuRata: 2.1 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#e8f4fd' }}>Analisis Data</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64a0c8' }}>Analisis distribusi ikan dan kondisi rantai dingin.</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: 'Selesai', value: govStats.selesai, color: '#34d399' },
          { label: 'Rata-rata Suhu', value: `${govStats.rataRataSuhu}°C`, color: '#06b6d4' },
          { label: 'Rata-rata FrostScore', value: govStats.rataRataFrostScore, color: '#60a5fa' },
          { label: 'Total Peringatan', value: govStats.totalPeringatan, color: '#fbbf24' },
          { label: 'Avg Durasi Perjalanan', value: `${govStats.rataRataDurasi}h`, color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
            <p className="text-xs mb-2" style={{ color: '#64a0c8' }}>{s.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Temp trend */}
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#e8f4fd' }}>Tren Suhu Harian</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)"/>
              <XAxis dataKey="time" tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0, 7]} tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}°`}/>
              <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 11 }}/>
              <Line type="monotone" dataKey="suhu" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FrostScore trend */}
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#e8f4fd' }}>Tren FrostScore Bulanan</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={frostScoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)"/>
              <XAxis dataKey="bulan" tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[60, 100]} tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 11 }}/>
              <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3, fill: '#60a5fa' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly shipments bar */}
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#e8f4fd' }}>Jumlah Pengiriman per Bulan</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyShipments} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)"/>
              <XAxis dataKey="bulan" tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#64a0c8', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 11 }}/>
              <Bar dataKey="total" name="Total" fill="#06b6d4" radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution pie */}
        <div className="rounded-xl p-4 border" style={{ background: '#0d2040', borderColor: 'rgba(6,182,212,0.12)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#e8f4fd' }}>Distribusi Status Risiko</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={riskData} cx={70} cy={70} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a1e38', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, color: '#e8f4fd', fontSize: 11 }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {riskData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }}/>
                  <span className="text-xs" style={{ color: '#e8f4fd' }}>{item.name}</span>
                  <span className="text-xs font-mono font-bold ml-auto" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problem locations */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#64a0c8' }}>LOKASI SERING BERMASALAH</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0a1e38', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
                {['Lokasi', 'Kejadian', 'Suhu Rata-rata', 'Risiko'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium" style={{ color: '#64a0c8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problemLocations.map((loc, i) => (
                <tr key={loc.lokasi} style={{ background: i % 2 === 0 ? '#0d2040' : 'rgba(13,32,64,0.5)', borderBottom: '1px solid rgba(6,182,212,0.06)' }}>
                  <td className="px-4 py-2.5" style={{ color: '#e8f4fd' }}>{loc.lokasi}</td>
                  <td className="px-4 py-2.5 font-mono" style={{ color: '#fbbf24' }}>{loc.kejadian}x</td>
                  <td className="px-4 py-2.5 font-mono" style={{ color: loc.suhuRata > 4 ? '#fbbf24' : '#34d399' }}>{loc.suhuRata}°C</td>
                  <td className="px-4 py-2.5">
                    <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(6,182,212,0.1)', width: 80 }}>
                      <div className="rounded-full h-1.5" style={{ width: `${(loc.kejadian / 10) * 100}%`, background: loc.suhuRata > 4 ? '#fbbf24' : '#34d399' }}/>
                    </div>
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
