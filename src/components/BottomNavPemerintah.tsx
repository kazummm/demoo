import { IconAlert, IconAnalysis, IconDashboard, IconMap } from './Layout'

export type PemerintahTab = 'beranda' | 'peta' | 'analitik' | 'peringatan' | 'lainnya'

const ICONS: Record<PemerintahTab, React.ReactNode> = {
  beranda: <IconDashboard />,
  peta: <IconMap />,
  analitik: <IconAnalysis />,
  peringatan: <IconAlert />,
  lainnya: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
}

export const PEMERINTAH_TABS: { id: PemerintahTab; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'peta', label: 'Peta' },
  { id: 'analitik', label: 'Analitik' },
  { id: 'peringatan', label: 'Peringatan' },
  { id: 'lainnya', label: 'Lainnya' },
]

interface Props {
  activeTab: PemerintahTab
  onChange: (tab: PemerintahTab) => void
}

export function PemerintahTabBar({ activeTab, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Menu pemerintah" className="hidden grid-cols-5 gap-1 rounded-xl p-1 md:grid" style={{ background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }}>
      {PEMERINTAH_TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className="min-h-12 rounded-lg text-sm font-semibold"
          style={activeTab === tab.id ? { background: 'var(--primary)', color: 'var(--primary-foreground)' } : { color: 'var(--muted-foreground)' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default function BottomNavPemerintah({ activeTab, onChange }: Props) {
  return (
    <nav aria-label="Navigasi pemerintah" className="fixed inset-x-0 bottom-0 z-50 md:hidden" style={{ background: '#0a1e38', borderTop: '1px solid var(--border)', boxShadow: '0 -6px 24px rgba(0,10,22,0.45)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {PEMERINTAH_TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <li key={tab.id}>
              <button onClick={() => onChange(tab.id)} aria-current={active ? 'page' : undefined} className="relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-semibold" style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                <span className="absolute inset-x-4 top-0 h-[3px] rounded-b-full" style={{ background: 'var(--primary)', opacity: active ? 1 : 0 }} />
                <span className={`[&>svg]:h-6 [&>svg]:w-6 ${active ? 'scale-110' : ''}`}>{ICONS[tab.id]}</span>
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
