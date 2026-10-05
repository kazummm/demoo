import { useState } from "react"
import QrMock from "../components/QrMock"

interface FormData {
  idBatch: string
  jenisIkan: string
  berat: string
  asal: string
  tujuan: string
  nelayan: string
  distributor: string
  tanggal: string
  kapal: string
}

const initial: FormData = {
  idBatch: "",
  jenisIkan: "",
  berat: "",
  asal: "Pangkep",
  tujuan: "Makassar",
  nelayan: "Ahmad Sulaiman",
  distributor: "PT Segar Bahari",
  tanggal: new Date().toISOString().slice(0, 10),
  kapal: "",
}

interface Props {
  onBack?: () => void
}

type CardKey = "data" | "logistik" | "identitas"

const FISH_TYPES = [
  "Ikan Kerapu",
  "Ikan Tenggiri",
  "Udang Vannamei",
  "Ikan Baronang",
  "Ikan Bandeng",
  "Ikan Cakalang",
]

function FormCard({
  title,
  icon,
  step,
  children,
}: {
  title: string
  icon: React.ReactNode
  step: number
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "rgba(10,30,60,0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(6,182,212,0.14)",
        boxShadow: "0 4px 20px rgba(0,10,25,0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-mono"
          style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.35)" }}
        >
          {step}
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#e8f4fd" }}>
          {icon}
          {title}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function Field({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

export default function RegistrasiBatch({ onBack }: Props) {
  const [form, setForm] = useState<FormData>(initial)
  const [saved, setSaved] = useState(false)

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const isComplete =
    form.idBatch.trim() !== "" &&
    form.jenisIkan !== "" &&
    form.berat !== "" &&
    form.kapal.trim() !== ""

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete) return
    setSaved(true)
  }

  const reset = () => {
    setForm({ ...initial, tanggal: new Date().toISOString().slice(0, 10) })
    setSaved(false)
  }

  const handleDownload = () => {
    // Build a small standalone SVG data URI and trigger download
    const svg = document.getElementById("qr-download-target")
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `QR-${form.idBatch || "batch"}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (saved) {
    return (
      <div className="space-y-6 max-w-lg">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: "rgba(6,182,212,0.08)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
              aria-label="Kembali"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#e8f4fd" }}>Registrasi Batch</h1>
            <p className="text-xs mt-0.5" style={{ color: "#64a0c8" }}>Batch berhasil didaftarkan</p>
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,30,60,0.65)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(34,197,94,0.25)",
            boxShadow: "0 0 32px rgba(34,197,94,0.08), 0 4px 20px rgba(0,10,25,0.3)",
          }}
        >
          {/* Success header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ background: "rgba(34,197,94,0.08)", borderBottom: "1px solid rgba(34,197,94,0.2)" }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#4ade80" }}>Batch berhasil didaftarkan!</p>
              <p className="text-xs" style={{ color: "#64a0c8" }}>QR Code siap diunduh dan dicetak</p>
            </div>
          </div>

          {/* QR + details */}
          <div className="px-5 py-5 flex flex-col sm:flex-row gap-6 items-start">
            {/* White-background QR for printing */}
            <div
              className="flex-shrink-0 rounded-xl p-3 self-center sm:self-start"
              style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              <div id="qr-download-target">
                <QrMock value={form.idBatch || "SMART-FROST"} size={124} inverted={false} />
              </div>
            </div>

            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <p className="text-xs" style={{ color: "#64a0c8" }}>ID Batch</p>
                <p className="text-2xl font-bold font-mono tracking-wide" style={{ color: "#06b6d4" }}>
                  {form.idBatch || "FR-NEW"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  ["Jenis Ikan", form.jenisIkan],
                  ["Berat", `${form.berat} kg`],
                  ["Rute", `${form.asal} → ${form.tujuan}`],
                  ["Kapal", form.kapal],
                  ["Nelayan", form.nelayan],
                  ["Distributor", form.distributor],
                  ["Tanggal", form.tanggal],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs" style={{ color: "#64a0c8" }}>{k}</p>
                    <p className="text-xs font-medium truncate" style={{ color: "#e8f4fd" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="px-5 pb-5 flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={handleDownload}
              className="btn-primary flex-1 gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Unduh QR
            </button>
            <button
              onClick={reset}
              className="btn-secondary flex-1 gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,4 1,10 7,10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Buat Batch Baru
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: "rgba(6,182,212,0.08)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.2)" }}
            aria-label="Kembali"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e8f4fd" }}>Registrasi Batch</h1>
          <p className="text-xs mt-0.5" style={{ color: "#64a0c8" }}>
            Daftarkan batch ikan baru untuk monitoring pengiriman
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Card 1: Data Ikan */}
        <FormCard
          step={1}
          title="Data Ikan"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1" />
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          }
        >
          <Field label="Jenis Ikan" full>
            <select
              value={form.jenisIkan}
              onChange={set("jenisIkan")}
              required
              className="input-field"
            >
              <option value="">Pilih jenis ikan…</option>
              {FISH_TYPES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Berat Ikan (kg)">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form.berat}
              onChange={set("berat")}
              required
              placeholder="e.g. 42.5"
              className="input-field"
            />
          </Field>
        </FormCard>

        {/* Card 2: Logistik */}
        <FormCard
          step={2}
          title="Logistik"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          }
        >
          <Field label="Asal">
            <input type="text" value={form.asal} onChange={set("asal")} required placeholder="Pangkep" className="input-field" />
          </Field>
          <Field label="Tujuan">
            <input type="text" value={form.tujuan} onChange={set("tujuan")} required placeholder="Makassar" className="input-field" />
          </Field>
          <Field label="Tanggal Pengiriman">
            <input type="date" value={form.tanggal} onChange={set("tanggal")} required className="input-field" />
          </Field>
          <Field label="Nomor / Nama Kapal">
            <input type="text" value={form.kapal} onChange={set("kapal")} required placeholder="KM Sinar Bahari" className="input-field" />
          </Field>
        </FormCard>

        {/* Card 3: Identitas */}
        <FormCard
          step={3}
          title="Identitas Pengiriman"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        >
          <Field label="ID Batch" full>
            <input
              type="text"
              value={form.idBatch}
              onChange={set("idBatch")}
              required
              placeholder="FR-005"
              className="input-field font-mono"
            />
          </Field>
          <Field label="Nama Nelayan">
            <input type="text" value={form.nelayan} onChange={set("nelayan")} required placeholder="Ahmad Sulaiman" className="input-field" />
          </Field>
          <Field label="Distributor">
            <input type="text" value={form.distributor} onChange={set("distributor")} required placeholder="PT Segar Bahari" className="input-field" />
          </Field>
        </FormCard>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!isComplete}
          aria-busy={false}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Simpan &amp; Buat QR Code
        </button>
      </form>
    </div>
  )
}
