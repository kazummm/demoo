import { useState } from 'react'

interface Props {
  onBack: () => void
}

const JENIS = ['Tangkap', 'Budidaya'] as const

const FIELDS = [
  { id: 'nama', label: 'Nama Lengkap', placeholder: 'Ahmad Sulaiman', autoComplete: 'name' },
  { id: 'kapal', label: 'ID Kapal', placeholder: 'KM-PKP-0142', autoComplete: 'off' },
  { id: 'ikan', label: 'Jenis Ikan', placeholder: 'Kerapu, Tenggiri', autoComplete: 'off' },
  { id: 'pelabuhan', label: 'Lokasi Pelabuhan', placeholder: 'Pelabuhan Pangkajene', autoComplete: 'off' },
] as const

export default function RegistrasiNelayan({ onBack }: Props) {
  const [values, setValues] = useState<Record<string, string>>({ nama: '', kapal: '', ikan: '', pelabuhan: '' })
  const [jenis, setJenis] = useState<(typeof JENIS)[number]>('Tangkap')
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  const missing = FIELDS.filter((f) => values[f.id].trim() === '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (missing.length === 0) setDone(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px]"
          style={{ color: 'var(--foreground)', border: '1px solid rgba(6,182,212,0.35)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Registrasi Nelayan</h1>
      </header>

      {done ? (
        <section role="status" className="card status-aman flex flex-col gap-4 p-5">
          <h2 className="text-lg font-bold" style={{ color: '#4ade80' }}>Pendaftaran Berhasil</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-mono">{values.kapal}</span> atas nama {values.nama} terdaftar sebagai nelayan {jenis.toLowerCase()}.
          </p>
          <button type="button" onClick={onBack} className="btn-secondary min-h-12">Kembali ke Beranda</button>
        </section>
      ) : (
        <form onSubmit={submit} noValidate className="card flex flex-col gap-6 p-4">
          {FIELDS.map((f) => {
            const invalid = touched && values[f.id].trim() === ''
            return (
              <div key={f.id}>
                <label htmlFor={f.id} className="label">{f.label}</label>
                <input
                  id={f.id}
                  value={values[f.id]}
                  onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `${f.id}-err` : undefined}
                  className={`input-field rounded-[10px] font-mono ${invalid ? 'is-error' : ''}`}
                />
                {invalid && (
                  <p id={`${f.id}-err`} className="mt-2 text-sm" style={{ color: '#fca5a5' }}>{f.label} wajib diisi.</p>
                )}
              </div>
            )
          })}

          <fieldset>
            <legend className="label">Jenis Perikanan</legend>
            <div className="grid grid-cols-2 gap-1 rounded-xl p-1" style={{ background: 'var(--background)', border: '1px solid rgba(6,182,212,0.35)' }}>
              {JENIS.map((j) => {
                const active = jenis === j
                return (
                  <label
                    key={j}
                    className="flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] text-base font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#06b6d4]"
                    style={{ background: active ? 'var(--primary)' : 'transparent', color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
                  >
                    <input type="radio" name="jenis" value={j} checked={active} onChange={() => setJenis(j)} className="sr-only" />
                    {j}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <button type="submit" className="btn-primary min-h-14 rounded-[10px] text-lg font-bold">Daftar Sekarang</button>
        </form>
      )}
    </div>
  )
}
