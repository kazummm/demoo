import { IconDashboard, IconBatch, IconHistory, IconScan } from './Layout'

export type DistributorTab = 'beranda' | 'stok' | 'scan' | 'riwayat' | 'profil'

const BAR = '#0f172a'
const ACTIVE = '#3b82f6'
const INACTIVE = '#64748b'

const ICONS: Record<DistributorTab, React.ReactNode> = {
  beranda: <IconDashboard />,
  stok: <IconBatch />,
  scan: <IconScan />,
  riwayat: <IconHistory />,
  profil: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
}

export const DISTRIBUTOR_TABS: { id: DistributorTab; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'stok', label: 'Stok' },
  { id: 'scan', label: 'Scan' },
  { id: 'riwayat', label: 'Riwayat' },
  { id: 'profil', label: 'Profil' },
]

interface Props {
  activeTab: DistributorTab
  onChange: (tab: DistributorTab) => void
}

export default function BottomNavDistributor({ activeTab, onChange }: Props) {
  return (
    <nav
      aria-label="Navigasi distributor"
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ background: BAR, borderTop: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 -6px 24px rgba(0,10,22,0.45)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {DISTRIBUTOR_TABS.map((t) => {
          const active = activeTab === t.id
          if (t.id === 'scan') {
            return (
              <li key={t.id} className="relative flex justify-center">
                <button
                  onClick={() => onChange(t.id)}
                  aria-label="Scan"
                  aria-current={active ? 'page' : undefined}
                  className="absolute -top-7 flex h-16 w-16 items-center justify-center rounded-full text-white transition-transform duration-200 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6 55%, #1d4ed8)', border: `4px solid ${BAR}`, boxShadow: '0 8px 24px rgba(59,130,246,0.5)' }}
                >
                  <span className="[&>svg]:h-7 [&>svg]:w-7">{ICONS.scan}</span>
                </button>
                <span className="mt-[42px] pb-2 text-[10px] font-semibold transition-colors duration-200" style={{ color: active ? ACTIVE : INACTIVE }}>Scan</span>
              </li>
            )
          }
          return (
            <li key={t.id}>
              <button
                onClick={() => onChange(t.id)}
                aria-current={active ? 'page' : undefined}
                className="relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-semibold transition-colors duration-200"
                style={{ color: active ? ACTIVE : INACTIVE }}
              >
                <span className="absolute inset-x-4 top-0 h-[3px] rounded-b-full transition-opacity duration-200" style={{ background: ACTIVE, opacity: active ? 1 : 0 }} />
                <span className={`transition-transform duration-200 [&>svg]:h-6 [&>svg]:w-6 ${active ? 'scale-110' : ''}`}>{ICONS[t.id]}</span>
                {t.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
