import { useState } from 'react'
import BrandLogo from './BrandLogo'
import { alerts, type Role } from '../data'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

export function IconDashboard() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
}
export function IconBatch() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}
function IconMonitor() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
}
function IconShip() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M5 20l-1-8h16l-1 8M12 4v8M9 12V8M15 12V8"/></svg>
}
function IconScore() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
}
function IconAlert() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function IconTrace() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/><circle cx="7" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
}
export function IconHistory() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
}
function IconMap() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
}
function IconAnalysis() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function IconReport() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
}
function IconConfirm() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
}
function IconSimulasi() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21"/></svg>
}
function IconLogout() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}

const nelayanNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'qr-batch', label: 'QR Batch', icon: <IconScan /> },
  { id: 'registrasi', label: 'Registrasi Batch', icon: <IconBatch /> },
  { id: 'monitoring', label: 'Monitoring', icon: <IconMonitor /> },
  { id: 'pengiriman', label: 'Pengiriman', icon: <IconShip /> },
  { id: 'frostscore', label: 'FrostScore', icon: <IconScore /> },
  { id: 'peringatan', label: 'Peringatan', icon: <IconAlert /> },
  { id: 'simulasi', label: 'Simulasi Sensor', icon: <IconSimulasi /> },
  { id: 'riwayat', label: 'Riwayat', icon: <IconHistory /> },
  { id: 'perbandingan', label: 'Perbandingan Layar', icon: <IconAnalysis /> },
  { id: 'registrasi-nelayan', label: 'Registrasi Nelayan', icon: <IconBatch /> },
]

export function IconScan() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><rect x="8" y="8" width="3" height="3"/><rect x="13" y="8" width="3" height="3"/><rect x="8" y="13" width="3" height="3"/><path d="M13 13h3v3"/></svg>
}

const tabDashboard: NavItem = { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> }
const tabMonitoring: NavItem = { id: 'monitoring', label: 'Monitoring', icon: <IconMonitor /> }
const tabPeringatan: NavItem = { id: 'peringatan', label: 'Peringatan', icon: <IconAlert /> }
const tabRiwayat: NavItem = { id: 'riwayat', label: 'Riwayat', icon: <IconHistory /> }
export const bottomNav: NavItem[] = [tabDashboard, tabPeringatan, { id: 'qr', label: 'QR Batch', icon: <IconScan /> }, tabRiwayat]

const distributorNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'pengiriman', label: 'Pengiriman', icon: <IconShip /> },
  { id: 'monitoring', label: 'Monitoring', icon: <IconMonitor /> },
  { id: 'frostscore', label: 'FrostScore', icon: <IconScore /> },
  { id: 'peringatan', label: 'Peringatan', icon: <IconAlert /> },
  { id: 'frosttrace', label: 'FrostTrace', icon: <IconTrace /> },
  { id: 'konfirmasi', label: 'Konfirmasi', icon: <IconConfirm /> },
  { id: 'riwayat', label: 'Riwayat', icon: <IconHistory /> },
]

const pemerintahNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'peta', label: 'Peta Distribusi', icon: <IconMap /> },
  { id: 'monitoring', label: 'Monitoring', icon: <IconMonitor /> },
  { id: 'pengiriman', label: 'Pengiriman', icon: <IconShip /> },
  { id: 'frostscore', label: 'FrostScore', icon: <IconScore /> },
  { id: 'peringatan', label: 'Peringatan', icon: <IconAlert /> },
  { id: 'analisis', label: 'Analisis', icon: <IconAnalysis /> },
  { id: 'frosttrace', label: 'Traceability', icon: <IconTrace /> },
  { id: 'laporan', label: 'Laporan', icon: <IconReport /> },
]

interface Props {
  role: Role
  name: string
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
  children: React.ReactNode
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED'
}

export default function Layout({ role, name, activePage, onNavigate, onLogout, children, connectionStatus }: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const isNelayan = role === 'nelayan'
  const mobileShell = isNelayan || role === 'distributor'

  const navItems = role === 'nelayan' ? nelayanNav : role === 'distributor' ? distributorNav : pemerintahNav

  const roleLabel = role === 'nelayan' ? 'Nelayan' : role === 'distributor' ? 'Distributor' : 'Pemerintah'
  const roleColor = role === 'nelayan' ? '#06b6d4' : role === 'distributor' ? '#8b5cf6' : '#f59e0b'

  const statusColor = connectionStatus === 'ONLINE' || connectionStatus === 'SYNCED'
    ? '#34d399'
    : connectionStatus === 'SYNCING' ? '#fbbf24' : '#f87171'

  return (
    <div className="relative flex h-dvh overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="cold-grid" />
      {/* Sidebar */}
      <aside
        className={`relative z-10 flex-col flex-shrink-0 transition-all duration-200 ${mobileShell ? 'hidden md:flex' : 'flex'}`}
        style={{
          width: collapsed ? 64 : 220,
          background: '#0a1e38',
          borderRight: '1px solid rgba(6,182,212,0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
          <BrandLogo variant="icon" width={32} className="rounded-lg" />
          {!collapsed && (
            <div>
              <p className="text-sm font-bold leading-none" style={{ color: '#e8f4fd' }}>SMART-FROST</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#06b6d4' }}>v1.0 Prototype</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded transition-colors hover:bg-white/5"
            style={{ color: '#64a0c8' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <polyline points="9,18 15,12 9,6"/> : <polyline points="15,18 9,12 15,6"/>}
            </svg>
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="mx-3 my-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}>
            <p className="text-xs font-medium truncate" style={{ color: '#e8f4fd' }}>{name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${roleColor}20`, color: roleColor, fontSize: '10px' }}>
                {roleLabel}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono" style={{ color: statusColor, fontSize: '10px' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                {connectionStatus}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all text-left"
                style={{
                  background: isActive ? 'rgba(6,182,212,0.15)' : 'transparent',
                  color: isActive ? '#06b6d4' : '#64a0c8',
                  borderLeft: isActive ? '2px solid #06b6d4' : '2px solid transparent',
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
            style={{ color: '#64a0c8' }}
          >
            <span className="flex-shrink-0"><IconLogout /></span>
            {!collapsed && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        {mobileShell && (
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 pb-2 md:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)', background: 'rgba(0,31,63,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => onNavigate('dashboard')} aria-label="Beranda SMART-FROST" className="flex min-h-12 items-center gap-2">
              <BrandLogo variant="icon" width={32} className="rounded-lg" />
              <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>SMART-FROST</span>
            </button>
            <button
              onClick={onLogout}
              aria-label="Keluar"
              className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <IconLogout />
              Keluar
            </button>
          </div>
        )}
        {/* Top bar */}
        <div className={`sticky top-0 z-10 px-6 py-3 items-center justify-between ${mobileShell ? 'hidden md:flex' : 'flex'}`} style={{ background: 'rgba(0,31,63,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
          <div>
            <p className="text-xs" style={{ color: '#64a0c8' }}>DATA SIMULASI PROTOTYPE</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColor }} />
            <span className="text-xs font-mono" style={{ color: statusColor }}>{connectionStatus}</span>
          </div>
        </div>
        <div className={mobileShell ? 'p-4 pb-28 md:p-6' : 'p-6'}>
          {children}
        </div>
      </main>

      
      {isNelayan && (
        <nav
          aria-label="Navigasi utama"
          className="fixed inset-x-0 bottom-0 z-20 md:hidden"
          style={{ background: '#0a1e38', borderTop: '1px solid rgba(6,182,212,0.25)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ul className="mx-auto grid max-w-md grid-cols-5">
            {[tabDashboard, tabMonitoring, null, tabPeringatan, tabRiwayat].map((item, idx) => {
              if (!item) {
                return (
                  <li key="qr" className="relative flex justify-center">
                    <button
                      onClick={() => onNavigate('qr-batch')}
                      aria-current={['qr-batch', 'buat-qr', 'qr-siap'].includes(activePage) ? 'page' : undefined}
                      aria-label="QR Batch"
                      className="absolute -top-7 flex h-16 w-16 items-center justify-center rounded-full transition-transform active:scale-95"
                      style={{ background: '#06b6d4', color: '#061220', border: '4px solid #0a1e38', boxShadow: '0 8px 24px rgba(6,182,212,0.55)' }}
                    >
                      <IconScan />
                    </button>
                    <span className="mt-[42px] pb-2 text-[11px] font-semibold" style={{ color: '#06b6d4' }}>QR Batch</span>
                  </li>
                )
              }
              const active = activePage === item.id || (item.id === 'riwayat' && activePage === 'pengiriman')
              const showDot = item.id === 'peringatan' && alerts.length > 0
              return (
                <li key={item.id + idx}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className="relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-0.5 text-[11px] font-semibold"
                    style={{ color: active ? '#06b6d4' : '#93c1e0' }}
                  >
                    {active && <span className="absolute inset-x-4 top-0 h-[3px] rounded-b-full" style={{ background: '#06b6d4' }} />}
                    <span className="relative [&>svg]:h-6 [&>svg]:w-6">
                      {item.icon}
                      {showDot && (
                        <span
                          aria-label={`${alerts.length} peringatan aktif`}
                          className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[10px] font-bold"
                          style={{ background: '#ef4444', color: '#fff' }}
                        >
                          {alerts.length}
                        </span>
                      )}
                    </span>
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
