import { useState } from 'react'
import { batches } from '../data'
import { SUB_TEXT } from '../components/Status'
import { qrStore, todayIso } from '../qrStore'

const JENIS = ['Ikan Kerapu', 'Ikan Tenggiri', 'Udang Vannamei', 'Ikan Baronang', 'Ikan Cakalang', 'Ikan Tongkol']
const TUJUAN_SARAN = ['Makassar', 'Maros', 'Parepare']

export default function BuatQrBatch({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [jenis, setJenis] = useState(JENIS[0])
  const [berat, setBerat] = useState('')
  const [asal, setAsal] = useState('Pangkep')
  const [tujuan, setTujuan] = useState('')
  const [tanggal, setTanggal] = useState(todayIso())
  const [distributor, setDistributor] = useState('')
  const [perangkat, setPerangkat] = useState(batches[0].deviceId)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState(false)
  const active = qrStore.activeBatch()
  const newId = qrStore.nextId()

  const create = () => {
    qrStore.create({ jenis, berat: Number(berat), asal: asal.trim(), tujuan: tujuan.trim(), tanggalBerangkat: tanggal, distributor: distributor.trim(), kapal: batches[0].kapal, perangkat: perangkat.trim() })
    onNavigate('qr-siap')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!tanggal) er.tanggal = 'Wajib diisi'
    if (!(Number(berat) > 0)) er.berat = 'Isi berat lebih dari 0'
    if (!asal.trim()) er.asal = 'Wajib diisi'
    if (!tujuan.trim()) er.tujuan = 'Wajib diisi'
    if (!distributor.trim()) er.distributor = 'Wajib diisi'
    if (!perangkat.trim()) er.perangkat = 'Wajib diisi'
    setErrors(er)
    if (Object.keys(er).length) return
    if (active) setConfirm(true)
    else create()
  }

  const lbl = 'mb-1.5 block text-sm font-semibold'
  const err = (k: string) => errors[k] && <p role="alert" className="mt-1 text-sm font-semibold" style={{ color: '#f87171' }}>{errors[k]}</p>

  return (
    <div className="mx-auto w-full max-w-md space-y-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Buat QR Batch</h1>
        <p className="mt-0.5 text-sm" style={{ color: SUB_TEXT }}>Isi data batch, lalu tempel QR di cool box sebelum berangkat.</p>
      </div>

      <form onSubmit={submit} noValidate className="card space-y-4 p-5">
        <div>
          <span className={lbl} style={{ color: SUB_TEXT }}>FrostID (otomatis)</span>
          <div className="input-field flex items-center font-mono font-bold" style={{ color: 'var(--primary)' }}>{newId}</div>
        </div>
        <div>
          <label htmlFor="tanggal" className={lbl} style={{ color: SUB_TEXT }}>Tanggal berangkat</label>
          <input id="tanggal" type="date" lang="id-ID" className={`input-field font-mono ${errors.tanggal ? 'is-error' : ''}`} value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          {err('tanggal')}
        </div>
        <div>
          <label htmlFor="jenis" className={lbl} style={{ color: SUB_TEXT }}>Jenis ikan</label>
          <select id="jenis" className="input-field" value={jenis} onChange={(e) => setJenis(e.target.value)}>{JENIS.map((j) => <option key={j}>{j}</option>)}</select>
        </div>
        <div>
          <label htmlFor="berat" className={lbl} style={{ color: SUB_TEXT }}>Berat (kg)</label>
          <input id="berat" type="number" inputMode="numeric" min="1" placeholder="contoh: 120" className={`input-field font-mono ${errors.berat ? 'is-error' : ''}`} value={berat} onChange={(e) => setBerat(e.target.value)} />
          {err('berat')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="asal" className={lbl} style={{ color: SUB_TEXT }}>Asal</label>
            <input id="asal" className={`input-field ${errors.asal ? 'is-error' : ''}`} value={asal} onChange={(e) => setAsal(e.target.value)} />
            {err('asal')}
          </div>
          <div>
            <label htmlFor="tujuan" className={lbl} style={{ color: SUB_TEXT }}>Tujuan</label>
            <input id="tujuan" list="tujuan-saran" placeholder="contoh: Makassar" className={`input-field ${errors.tujuan ? 'is-error' : ''}`} value={tujuan} onChange={(e) => setTujuan(e.target.value)} />
            <datalist id="tujuan-saran">{TUJUAN_SARAN.map((t) => <option key={t} value={t} />)}</datalist>
            {err('tujuan')}
          </div>
        </div>
        <div>
          <label htmlFor="distributor" className={lbl} style={{ color: SUB_TEXT }}>Distributor tujuan</label>
          <input id="distributor" placeholder="contoh: UD Bahari Jaya" className={`input-field ${errors.distributor ? 'is-error' : ''}`} value={distributor} onChange={(e) => setDistributor(e.target.value)} />
          {err('distributor')}
        </div>
        <div>
          <label htmlFor="perangkat" className={lbl} style={{ color: SUB_TEXT }}>Kapal / Cool box (ID perangkat IoT)</label>
          <input id="perangkat" className={`input-field font-mono ${errors.perangkat ? 'is-error' : ''}`} value={perangkat} onChange={(e) => setPerangkat(e.target.value)} />
          {err('perangkat')}
        </div>
        <button type="submit" className="btn-primary min-h-14 text-lg font-bold">Buat QR</button>
      </form>

      {confirm && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,10,22,0.85)' }}>
          <div role="alertdialog" aria-label="Konfirmasi batch baru" className="card w-full max-w-sm space-y-4 p-6">
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              Batch <span className="font-mono" style={{ color: 'var(--primary)' }}>{active.id}</span> masih aktif. Buat batch baru?
            </p>
            <p className="text-base" style={{ color: SUB_TEXT }}>Batch lama akan ditandai selesai.</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary min-h-12" onClick={() => setConfirm(false)}>Batal</button>
              <button className="btn-primary min-h-12 font-bold" onClick={create}>Ya, Buat Baru</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
