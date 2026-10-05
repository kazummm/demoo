import { useEffect, useMemo, useRef, useState } from 'react'
import { batches, alerts, getFrostScoreCategory } from '../data'
import FrostTraceTimeline from '../components/FrostTraceTimeline'
import { StatusBadge, getStatusFromSuhu, STATUS_RANK, SUB_TEXT } from '../components/Status'
import BottomNavDistributor, { DISTRIBUTOR_TABS, type DistributorTab } from '../components/BottomNavDistributor'
import { qrStore, useQrBatches, useDistribusi, type Tahap } from '../qrStore'

const ACCENT = '#3b82f6'
const ACCENT_SOFT = '#93c5fd'
const KUALITAS = ['Sangat Baik', 'Baik', 'Cukup']
const KAPASITAS_KG = 2000
const STOK_DASAR_KG = 1480

interface Row {
  id: string
  jenis: string
  berat: number
  asal: string
  tujuan: string
  nelayan: string
  suhu?: number
  frostScore?: number
}

const EMPTY: Record<Tahap, string> = {
  masuk: 'Tidak ada batch yang menunggu diterima.',
  stok: 'Belum ada batch di gudang.',
  keluar: 'Belum ada batch yang dikeluarkan.',
}

const primaryBtn = { background: `linear-gradient(135deg, #60a5fa, ${ACCENT} 55%, #1d4ed8)`, color: '#fff', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }
const panel = { background: 'rgba(13,32,64,0.85)', border: '1px solid rgba(147,197,253,0.18)' }

function Pending() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(147,193,224,0.15)', color: SUB_TEXT }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      Menunggu data
    </span>
  )
}

function Score({ v }: { v?: number }) {
  if (v === undefined) return <span className="font-mono text-sm" style={{ color: SUB_TEXT }}>-</span>
  return <span className="font-mono text-sm font-bold" style={{ color: getFrostScoreCategory(v).color }}>{v}</span>
}

function StatusCell({ suhu }: { suhu?: number }) {
  return suhu === undefined ? <Pending /> : <StatusBadge status={getStatusFromSuhu(suhu)} size="sm" />
}

function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" style={{ background: 'rgba(0,10,22,0.85)' }} onClick={onClose}>
      <div role="dialog" aria-label={label} className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl p-5 sm:rounded-2xl" style={{ ...panel, background: '#0a1e38' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function DashboardDistributor({ onNavigate }: { onNavigate: (page: string) => void }) {
  const qr = useQrBatches()
  const dist = useDistribusi()
  const [activeTab, setActiveTab] = useState<DistributorTab>('beranda')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [scanValue, setScanValue] = useState('')
  const [scanError, setScanError] = useState('')
  const [kualitas, setKualitas] = useState('Baik')
  const [confirming, setConfirming] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState<'mati' | 'menyala' | 'ditolak'>('mati')

  useEffect(() => {
    if (activeTab !== 'scan') return
    let stream: MediaStream | null = null
    let timer = 0
    let cancelled = false
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera('ditolak')
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(async (s) => {
        if (cancelled) return s.getTracks().forEach((t) => t.stop())
        stream = s
        const v = videoRef.current
        if (!v) return
        v.srcObject = s
        await v.play().catch(() => {})
        setCamera('menyala')
        const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector
        if (!BD) return
        const det = new BD({ formats: ['qr_code'] })
        timer = window.setInterval(async () => {
          try {
            const r = await det.detect(v)
            if (r[0]?.rawValue) {
              setScanValue(r[0].rawValue.trim().toUpperCase())
              setScanError('')
            }
          } catch {
            /* frame belum siap */
          }
        }, 500)
      })
      .catch(() => !cancelled && setCamera('ditolak'))
    return () => {
      cancelled = true
      window.clearInterval(timer)
      stream?.getTracks().forEach((t) => t.stop())
      setCamera('mati')
    }
  }, [activeTab])

  const rows = useMemo<Row[]>(() => {
    const map = new Map<string, Row>()
    for (const b of batches) map.set(b.id, { id: b.id, jenis: b.jenis, berat: b.berat, asal: b.asal, tujuan: b.tujuan, nelayan: b.nelayan, suhu: b.suhu, frostScore: b.frostScore })
    for (const q of qr) {
      const prev = map.get(q.id)
      map.set(q.id, { id: q.id, jenis: q.jenis, berat: q.berat, asal: q.asal, tujuan: q.tujuan, nelayan: prev?.nelayan ?? q.nelayan ?? '-', suhu: prev?.suhu, frostScore: prev?.frostScore })
    }
    return [...map.values()].sort((a, b) => b.id.localeCompare(a.id))
  }, [qr])

  const tahapOf = (id: string): Tahap => dist[id]?.tahap ?? 'masuk'
  const counts = { masuk: 0, stok: 0, keluar: 0 } as Record<Tahap, number>
  rows.forEach((r) => counts[tahapOf(r.id)]++)
  const stokKg = rows.filter((r) => tahapOf(r.id) === 'stok').reduce((a, r) => a + r.berat, 0)
  const kapasitas = Math.min(100, Math.round(((STOK_DASAR_KG + stokKg) / KAPASITAS_KG) * 100))
  const kapColor = kapasitas >= 90 ? '#fbbf24' : ACCENT_SOFT
  const detail = rows.find((r) => r.id === detailId) ?? null

  const openDetail = (id: string) => {
    setKualitas(dist[id]?.kualitas ?? 'Baik')
    setConfirming(false)
    setDetailId(id)
  }

  const scan = (e?: React.FormEvent) => {
    e?.preventDefault()
    const id = scanValue.trim().toUpperCase()
    const found = rows.find((r) => r.id === id)
    if (!found) return setScanError(`QR "${scanValue.trim() || '-'}" tidak dikenali.`)
    setScanValue('')
    setScanError('')
    openDetail(found.id)
  }

  const terima = () => {
    if (!detail) return
    qrStore.terima(detail.id, kualitas)
    setActiveTab('stok')
    setConfirming(false)
    setDetailId(null)
  }

  const detailStatus = detail && detail.suhu !== undefined ? getStatusFromSuhu(detail.suhu) : null
  const detailTahap = detail ? tahapOf(detail.id) : 'masuk'

  const renderList = (tahap: Tahap) => {
    const rank = (r: Row) => (r.suhu === undefined ? 2.5 : STATUS_RANK[getStatusFromSuhu(r.suhu)])
    const visible = rows.filter((r) => tahapOf(r.id) === tahap).sort((a, b) => rank(a) - rank(b))
    return (
visible.length === 0 ? (
        <p className="rounded-2xl p-8 text-center text-sm" style={{ ...panel, color: SUB_TEXT }}>{EMPTY[tahap]}</p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl md:block" style={panel}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(59,130,246,0.12)' }}>
                  {['ID Batch', 'Nama Nelayan', 'FrostScore', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: ACCENT_SOFT }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="cursor-pointer hover:bg-white/5" onClick={() => openDetail(r.id)} style={{ borderTop: '1px solid rgba(147,197,253,0.1)' }}>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: ACCENT_SOFT }}>{r.id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{r.nelayan}</td>
                    <td className="px-4 py-3"><Score v={r.frostScore} /></td>
                    <td className="px-4 py-3"><StatusCell suhu={r.suhu} /></td>
                    <td className="px-4 py-2 text-right">
                      <button className="min-h-10 rounded-lg px-3 text-sm font-semibold" style={{ color: ACCENT_SOFT, border: '1px solid rgba(147,197,253,0.3)' }} onClick={(e) => { e.stopPropagation(); openDetail(r.id) }}>{tahap === 'masuk' ? 'Konfirmasi Terima' : 'Detail'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {visible.map((r) => (
              <li key={r.id}>
                <button onClick={() => openDetail(r.id)} className="flex min-h-16 w-full items-center gap-3 rounded-2xl p-4 text-left" style={panel}>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-mono text-lg font-bold" style={{ color: ACCENT_SOFT }}>{r.id}</p>
                    <p className="truncate text-sm" style={{ color: 'var(--foreground)' }}>{r.nelayan}</p>
                    <StatusCell suhu={r.suhu} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: SUB_TEXT }}>FrostScore</p>
                    <p className="text-2xl"><Score v={r.frostScore} /></p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )
    )
  }

  const sectionTitle = (t: string, n?: number) => (
    <h2 className="text-sm font-bold" style={{ color: ACCENT_SOFT }}>{t}{n !== undefined && <span className="font-mono"> ({n})</span>}</h2>
  )

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-20 md:pb-0">
      <div role="tablist" aria-label="Menu distributor" className="hidden grid-cols-5 gap-1 rounded-xl p-1 md:grid" style={{ ...panel }}>
        {DISTRIBUTOR_TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={activeTab === t.id} onClick={() => setActiveTab(t.id)} className="min-h-12 rounded-lg text-sm font-semibold" style={activeTab === t.id ? primaryBtn : { color: SUB_TEXT }}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="space-y-5">
        {activeTab === 'beranda' && (
          <>
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5" style={panel}>
        <div>
          <p className="text-xs font-semibold tracking-wide" style={{ color: ACCENT_SOFT }}>DISTRIBUTOR</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>PT Segar Bahari</h1>
          <p className="text-sm" style={{ color: SUB_TEXT }}>Gudang Utama - Kapasitas {kapasitas}%</p>
        </div>
        <div className="w-full sm:w-56">
          <div className="mb-1 flex justify-between font-mono text-xs" style={{ color: SUB_TEXT }}>
            <span>{STOK_DASAR_KG + stokKg} kg</span>
            <span>{KAPASITAS_KG} kg</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full" style={{ background: 'rgba(147,197,253,0.15)' }} role="progressbar" aria-valuenow={kapasitas} aria-valuemin={0} aria-valuemax={100} aria-label="Kapasitas gudang">
            <div className="h-full rounded-full" style={{ width: `${kapasitas}%`, background: kapColor }} />
          </div>
        </div>
      </header>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: 'Pengiriman Aktif', value: rows.length - counts.keluar, color: '#06b6d4' },
                { label: 'Akan Diterima', value: counts.masuk, color: ACCENT_SOFT },
                { label: 'Peringatan', value: alerts.length, color: '#fbbf24' },
                { label: 'Selesai Hari Ini', value: counts.keluar, color: '#34d399' },
              ].map((st) => (
                <div key={st.label} className="rounded-xl border p-4" style={{ background: '#0d2040', borderColor: 'rgba(147,197,253,0.18)' }}>
                  <p className="mb-2 text-xs" style={{ color: SUB_TEXT }}>{st.label}</p>
                  <p className="font-mono text-2xl font-bold" style={{ color: st.color }}>{st.value}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setActiveTab('scan')} className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl text-xl font-bold" style={primaryBtn}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" /><path d="M4 12h16" /></svg>
              Scan QR Batch
            </button>

            {sectionTitle('Batch Masuk', counts.masuk)}
            {renderList('masuk')}

            {sectionTitle('Peringatan Aktif', alerts.length)}
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border p-3" style={{ background: getStatusFromSuhu(a.suhu) === 'RISIKO' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)', borderColor: getStatusFromSuhu(a.suhu) === 'RISIKO' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)' }}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color: 'var(--foreground)' }}>{a.batch}</span>
                      <StatusBadge status={getStatusFromSuhu(a.suhu)} size="sm" />
                      <span className="font-mono text-xs" style={{ color: '#06b6d4' }}>{a.suhu}°C</span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: SUB_TEXT }}>{a.lokasi} · {a.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'stok' && (
          <>
            {sectionTitle('Stok Gudang', counts.stok)}
            {renderList('stok')}
          </>
        )}

        {activeTab === 'scan' && (
          <section className="mx-auto max-w-lg space-y-4 pb-24 md:pb-0">
            <div className="relative aspect-[3/4] max-h-[52dvh] w-full overflow-hidden rounded-2xl" style={{ ...panel, background: '#000' }}>
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" aria-label="Pratinjau kamera" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 rounded-2xl" style={{ border: '3px solid #fff', boxShadow: '0 0 0 999px rgba(0,10,22,0.45)' }} />
              </div>
              {camera !== 'menyala' && (
                <p className="absolute inset-x-4 bottom-4 rounded-lg p-3 text-center text-sm" style={{ background: 'rgba(0,10,22,0.8)', color: SUB_TEXT }}>
                  {camera === 'ditolak' ? 'Kamera tidak tersedia atau izin ditolak. Ketik FrostID di bawah.' : 'Menyalakan kamera...'}
                </p>
              )}
            </div>
            <form onSubmit={scan} className="space-y-3 rounded-2xl p-4" style={panel}>
              <label className="text-sm font-semibold" style={{ color: ACCENT_SOFT }} htmlFor="frostid">FrostID (otomatis terisi saat QR terbaca)</label>
              <input id="frostid" value={scanValue} onChange={(e) => { setScanValue(e.target.value); setScanError('') }} placeholder="contoh: FR-004" className={`input-field font-mono ${scanError ? 'is-error' : ''}`} />
              {scanError && <p role="alert" className="text-sm font-semibold" style={{ color: '#f87171' }}>{scanError}</p>}
              <div className="flex flex-wrap gap-2">
                {rows.filter((r) => tahapOf(r.id) === 'masuk').map((r) => (
                  <button key={r.id} type="button" onClick={() => setScanValue(r.id)} className="min-h-10 rounded-full px-3 font-mono text-sm" style={{ border: '1px solid rgba(147,197,253,0.3)', color: ACCENT_SOFT }}>{r.id}</button>
                ))}
              </div>
            </form>
            <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 px-4 md:static md:px-0">
              <button type="button" onClick={() => scan()} className="mx-auto block min-h-14 w-full max-w-lg rounded-xl text-lg font-bold" style={primaryBtn}>Konfirmasi</button>
            </div>
          </section>
        )}

        {activeTab === 'riwayat' && (
          <>
            {sectionTitle('Riwayat Keluar', counts.keluar)}
            {renderList('keluar')}
          </>
        )}

        {activeTab === 'profil' && (
          <section className="mx-auto max-w-lg space-y-3 rounded-2xl p-5" style={panel}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>PT Segar Bahari</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Peran', 'Distributor'],
                ['Gudang', 'Gudang Utama'],
                ['Kapasitas', `${kapasitas}% · ${STOK_DASAR_KG + stokKg} / ${KAPASITAS_KG} kg`],
                ['Batch di stok', String(counts.stok)],
                ['Batch menunggu', String(counts.masuk)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b pb-2" style={{ borderColor: 'rgba(147,197,253,0.12)' }}>
                  <dt style={{ color: SUB_TEXT }}>{k}</dt>
                  <dd className="font-semibold" style={{ color: 'var(--foreground)' }}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="pt-2">
              <h3 className="mb-2 text-sm font-bold" style={{ color: ACCENT_SOFT }}>Menu Lainnya</h3>
              <ul className="grid grid-cols-2 gap-2">
                {[
                  ['pengiriman', 'Pengiriman'],
                  ['monitoring', 'Monitoring'],
                  ['frostscore', 'FrostScore'],
                  ['peringatan', 'Peringatan'],
                  ['frosttrace', 'FrostTrace'],
                  ['riwayat', 'Riwayat Lengkap'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => onNavigate(id)} className="min-h-12 w-full rounded-lg px-3 text-sm font-semibold" style={{ color: ACCENT_SOFT, border: '1px solid rgba(147,197,253,0.3)' }}>{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <BottomNavDistributor activeTab={activeTab} onChange={setActiveTab} />
      {detail && (
        <Modal label={`Detail ${detail.id}`} onClose={() => setDetailId(null)}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-2xl font-bold" style={{ color: ACCENT_SOFT }}>{detail.id}</p>
                <p className="text-base" style={{ color: 'var(--foreground)' }}>{detail.jenis} · {detail.berat} kg</p>
                <p className="text-sm" style={{ color: SUB_TEXT }}>{detail.nelayan} · {detail.asal} → {detail.tujuan}</p>
              </div>
              <button onClick={() => setDetailId(null)} aria-label="Tutup" className="min-h-10 min-w-10 rounded-lg text-xl" style={{ color: SUB_TEXT }}>×</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <p className="text-xs" style={{ color: SUB_TEXT }}>Suhu</p>
                <p className="font-mono text-lg font-bold" style={{ color: 'var(--foreground)' }}>{detail.suhu !== undefined ? `${detail.suhu}°C` : '-'}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <p className="text-xs" style={{ color: SUB_TEXT }}>FrostScore</p>
                <p className="text-lg"><Score v={detail.frostScore} /></p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <p className="mb-1 text-xs" style={{ color: SUB_TEXT }}>Status</p>
                <StatusCell suhu={detail.suhu} />
              </div>
            </div>

            <section>
              <h3 className="mb-3 text-sm font-bold" style={{ color: ACCENT_SOFT }}>Riwayat Perjalanan</h3>
              <FrostTraceTimeline accent={ACCENT} />
            </section>

            {detailTahap === 'masuk' && (
              <section className="space-y-3">
                <h3 className="text-sm font-bold" style={{ color: ACCENT_SOFT }}>Validasi Kualitas</h3>
                <select aria-label="Validasi kualitas" value={kualitas} onChange={(e) => setKualitas(e.target.value)} className="input-field">
                  {KUALITAS.map((k) => <option key={k}>{k}</option>)}
                </select>
                {!confirming ? (
                  <button onClick={() => setConfirming(true)} className="min-h-14 w-full rounded-lg text-lg font-bold" style={primaryBtn}>Konfirmasi Terima</button>
                ) : (
                  <div role="group" aria-label="Konfirmasi terima" className="space-y-3 rounded-xl p-4" style={{ border: '1px solid rgba(147,197,253,0.3)' }}>
                    <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Terima {detail.id}?</p>
                    {detailStatus && detailStatus !== 'AMAN' && (
                      <p role="alert" className="text-sm font-semibold" style={{ color: detailStatus === 'RISIKO' ? '#f87171' : '#fbbf24' }}>
                        Batch ini {detailStatus} — periksa fisik ikan sebelum menerima.
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setConfirming(false)} className="min-h-12 rounded-lg font-semibold" style={{ color: ACCENT_SOFT, border: '1px solid rgba(147,197,253,0.3)' }}>Batal</button>
                      <button onClick={terima} className="min-h-12 rounded-lg font-bold" style={primaryBtn}>Ya, Terima</button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {detailTahap === 'stok' && (
              <section className="space-y-3">
                <p className="text-sm" style={{ color: SUB_TEXT }}>Diterima {dist[detail.id]?.waktu ?? '-'} · Kualitas <strong style={{ color: 'var(--foreground)' }}>{dist[detail.id]?.kualitas ?? '-'}</strong></p>
                <button onClick={() => { qrStore.keluarkan(detail.id); setActiveTab('riwayat'); setDetailId(null) }} className="min-h-12 w-full rounded-lg font-bold" style={primaryBtn}>Keluarkan dari Gudang</button>
              </section>
            )}

            {detailTahap === 'keluar' && (
              <p className="text-sm" style={{ color: SUB_TEXT }}>Dikeluarkan {dist[detail.id]?.waktu ?? '-'} · Kualitas <strong style={{ color: 'var(--foreground)' }}>{dist[detail.id]?.kualitas ?? '-'}</strong></p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
