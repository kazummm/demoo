import { useEffect, useRef, useState } from 'react'
import BrandLogo from '../components/BrandLogo'
import { demoAccounts, type Role } from '../data'

interface Props {
  onLogin: (role: Role, name: string) => void
}

const ROLES: { id: Role; label: string }[] = [
  { id: 'nelayan', label: 'Nelayan' },
  { id: 'distributor', label: 'Distributor' },
  { id: 'pemerintah', label: 'Pemerintah' },
]

const roleLabel = (r: Role) => ROLES.find((x) => x.id === r)!.label

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  )
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('nelayan')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filledRole, setFilledRole] = useState<Role | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const canSubmit = email.trim() !== '' && password !== '' && !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setLoading(true)
    timer.current = setTimeout(() => {
      const account = demoAccounts.find(
        (a) => a.email === email.trim() && a.password === password && a.role === role
      )
      if (account) {
        onLogin(account.role, account.name)
      } else {
        setError('Email, kata sandi, atau peran tidak sesuai. Periksa kembali atau pakai akun demo.')
        setLoading(false)
      }
    }, 600)
  }

  const fillDemo = (r: Role) => {
    const acc = demoAccounts.find((a) => a.role === r)!
    setEmail(acc.email)
    setPassword(acc.password)
    setRole(r)
    setFilledRole(r)
    setError('')
  }

  const changeRole = (r: Role) => {
    setRole(r)
    setError('')
    if (filledRole && filledRole !== r) setFilledRole(null)
  }

  const hasError = error !== ''

  return (
    <div className="relative min-h-dvh overflow-x-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8 sm:py-12">
        <header className="mb-8 flex flex-col items-center text-center">
          <BrandLogo variant="primary" width={208} onDark />
          <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-tight" style={{ color: 'var(--foreground)' }}>
            SMART-FROST
          </h1>
          <p className="mt-2 font-mono text-sm font-medium" style={{ color: 'var(--primary)' }}>
            Sistem Monitoring Rantai Dingin
          </p>
          <p className="mt-3 max-w-xs text-base leading-6" style={{ color: 'var(--muted-foreground)' }}>
            Pantau suhu, jaga mutu, telusuri perjalanan hasil perikanan.
          </p>
        </header>

        <section className="card p-6 glow-cyan" aria-labelledby="login-title">
          <h2 id="login-title" className="mb-6 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
            Masuk ke akun Anda
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="nama@smartfrost.id"
                disabled={loading}
                aria-invalid={hasError}
                aria-describedby={hasError ? 'login-error' : undefined}
                className={`input-field ${hasError ? 'is-error' : ''}`}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Kata sandi</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Masukkan kata sandi"
                  disabled={loading}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? 'login-error' : undefined}
                  className={`input-field pr-12 ${hasError ? 'is-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            <fieldset>
              <legend className="label">Masuk sebagai</legend>
              <div className="grid grid-cols-3 gap-1 rounded-xl p-1" style={{ background: 'var(--background)', border: '1px solid rgba(6,182,212,0.35)' }}>
                {ROLES.map((r) => {
                  const active = role === r.id
                  return (
                    <label
                      key={r.id}
                      className="relative flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-1 text-center text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#06b6d4]"
                      style={{
                        background: active ? 'var(--primary)' : 'transparent',
                        color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.id}
                        checked={active}
                        disabled={loading}
                        onChange={() => changeRole(r.id)}
                        className="sr-only"
                      />
                      {r.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {hasError && (
              <p
                id="login-error"
                role="alert"
                className="rounded-xl px-4 py-3 text-sm leading-5"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.5)' }}
              >
                {error}
              </p>
            )}

            <button type="submit" disabled={!canSubmit} aria-busy={loading} className="btn-primary">
              {loading && (
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? 'Memproses…' : `Masuk sebagai ${roleLabel(role)}`}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Akun demo</h3>
            <p className="helper-text mt-1">Pilih peran untuk mengisi email dan kata sandi otomatis.</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const selected = filledRole === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => fillDemo(r.id)}
                    disabled={loading}
                    aria-pressed={selected}
                    className="flex min-h-12 items-center justify-center gap-1 rounded-xl px-1 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55"
                    style={{
                      background: selected ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.06)',
                      color: selected ? 'var(--foreground)' : 'var(--primary)',
                      border: `1px solid ${selected ? 'var(--primary)' : 'rgba(6,182,212,0.35)'}`,
                    }}
                  >
                    {selected && <CheckIcon />}
                    {r.label}
                  </button>
                )
              })}
            </div>

            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm leading-5" style={{ color: 'var(--success)' }}>
              {filledRole && `Peran ${roleLabel(filledRole)} dipilih. Email dan kata sandi terisi otomatis.`}
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-[13px] leading-5" style={{ color: 'var(--subtle-foreground)' }}>
          Data simulasi prototipe · GEMASTIK 2026
        </p>
      </main>
    </div>
  )
}
