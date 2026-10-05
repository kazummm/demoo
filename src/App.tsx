import { useEffect, useState } from 'react'
import type { Role } from './data'
import { session, distributorNav, pemerintahNav } from './session'
import BackBar from './components/BackBar'
import BottomNavDistributor, { type DistributorTab } from './components/BottomNavDistributor'
import BottomNavPemerintah, { PemerintahTabBar, type PemerintahTab } from './components/BottomNavPemerintah'
import Login from './pages/Login'
import Layout from './components/Layout'
import DashboardNelayan from './pages/DashboardNelayan'
import DashboardDistributor from './pages/DashboardDistributor'
import DashboardPemerintah from './pages/DashboardPemerintah'
import RegistrasiBatch from './pages/RegistrasiBatch'
import QrBatch from './pages/QrBatch'
import BuatQrBatch from './pages/BuatQrBatch'
import QrSiap from './pages/QrSiap'
import Device from './pages/Device'
import Monitoring from './pages/Monitoring'
import Pengiriman from './pages/Pengiriman'
import FrostScore from './pages/FrostScore'
import Peringatan from './pages/Peringatan'
import FrostTrace from './pages/FrostTrace'
import Simulasi from './pages/Simulasi'
import Riwayat from './pages/Riwayat'
import PetaDistribusi from './pages/PetaDistribusi'
import Analisis from './pages/Analisis'
import Laporan from './pages/Laporan'
import PerbandinganLayar from './pages/PerbandinganLayar'
import RegistrasiNelayan from './pages/RegistrasiNelayan'

interface AuthState {
  role: Role
  name: string
}

function PageContent({ page, role, onNavigate }: { page: string; role: Role; onNavigate: (p: string) => void }) {
  if (page === 'dashboard') {
    if (role === 'nelayan') return <DashboardNelayan onNavigate={onNavigate} />
    if (role === 'distributor') return <DashboardDistributor onNavigate={onNavigate} />
    return <DashboardPemerintah onNavigate={onNavigate} />
  }
  if (page === 'registrasi') return <RegistrasiBatch onBack={() => onNavigate('dashboard')} />
  if (page === 'qr-batch') return <QrBatch onNavigate={onNavigate} />
  if (page === 'buat-qr') return <BuatQrBatch onNavigate={onNavigate} />
  if (page === 'qr-siap') return <QrSiap onNavigate={onNavigate} />
  if (page === 'device') return <Device />
  if (page === 'monitoring') return <Monitoring role={role} />
  if (page === 'pengiriman') return <Pengiriman />
  if (page === 'frostscore') return <FrostScore />
  if (page === 'peringatan') return <Peringatan role={role} />
  if (page === 'frosttrace') return <FrostTrace role={role} />
  if (page === 'perbandingan') return <PerbandinganLayar />
  if (page === 'registrasi-nelayan') return <RegistrasiNelayan onBack={() => onNavigate('dashboard')} />
  if (page === 'simulasi') return <Simulasi />
  if (page === 'riwayat') return <Riwayat role={role} />
  if (page === 'peta') return <PetaDistribusi />
  if (page === 'analisis') return <Analisis />
  if (page === 'konfirmasi') return <DashboardDistributor onNavigate={onNavigate} />
  if (page === 'laporan') return <Laporan />
  return <div style={{ color: 'var(--muted-foreground)' }}>Halaman tidak ditemukan.</div>
}

const SUB_TITLES: Record<string, string> = {
  pengiriman: 'Pengiriman',
  monitoring: 'Monitoring Suhu',
  frostscore: 'FrostScore',
  peringatan: 'Peringatan',
  frosttrace: 'FrostTrace',
  riwayat: 'Semua Riwayat Pengiriman',
}

const GOVERNMENT_SUB_TITLES: Record<string, string> = {
  monitoring: 'Monitoring Suhu',
  frosttrace: 'FrostTrace',
  riwayat: 'Riwayat Pengiriman',
}

const GOVERNMENT_PAGES: Record<PemerintahTab, string> = {
  beranda: 'dashboard',
  peta: 'peta',
  analitik: 'analisis',
  peringatan: 'peringatan',
  lainnya: 'lainnya',
}

function PemerintahLainnya({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Lainnya</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Akses data operasional dalam mode lihat saja.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ['monitoring', 'Monitoring Suhu', 'Pantau tren suhu seluruh pengiriman.'],
          ['frosttrace', 'FrostTrace', 'Lihat jejak perjalanan tanpa data pribadi.'],
          ['riwayat', 'Riwayat Pengiriman', 'Tinjau arsip pengiriman lintas periode.'],
        ].map(([id, label, description]) => (
          <button key={id} onClick={() => onNavigate(id)} className="min-h-24 rounded-xl p-4 text-left" style={{ background: 'rgba(10,42,78,0.75)', border: '1px solid var(--border)' }}>
            <span className="block font-semibold" style={{ color: 'var(--foreground)' }}>{label}</span>
            <span className="mt-1 block text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>Data simulasi prototipe · GEMASTIK 2026</p>
    </section>
  )
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [page, setPage] = useState('dashboard')
  const [connection] = useState<'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED'>('ONLINE')
  const [pemerintahTab, setPemerintahTab] = useState<PemerintahTab>(() => pemerintahNav.peek() as PemerintahTab)

  useEffect(() => {
    const onPop = () => {
      if (session.role() === 'pemerintah') {
        pemerintahNav.set('lainnya')
        setPemerintahTab('lainnya')
        setPage('lainnya')
      } else {
        setPage('dashboard')
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (p: string) => {
    if (auth?.role === 'pemerintah') {
      const topLevel = (Object.entries(GOVERNMENT_PAGES) as [PemerintahTab, string][]).find(([, governmentPage]) => governmentPage === p)
      if (topLevel) {
        pemerintahNav.set(topLevel[0])
        setPemerintahTab(topLevel[0])
      }
      if (['device', 'simulasi', 'laporan'].includes(p)) {
        setPemerintahTab('beranda')
        pemerintahNav.set('beranda')
        setPage('dashboard')
        return
      }
      if (page === 'lainnya' && ['monitoring', 'frosttrace', 'riwayat'].includes(p)) {
        setPemerintahTab('lainnya')
        pemerintahNav.set('lainnya')
        window.history.pushState({ sf: p }, '')
      }
    }
    if (auth?.role === 'distributor' && page === 'dashboard' && p !== 'dashboard') {
      distributorNav.set('profil')
      window.history.pushState({ sf: p }, '')
    }
    setPage(p)
  }

  const backToDashboard = () => {
    if (window.history.state?.sf) window.history.back()
    else setPage('dashboard')
  }

  const backToPemerintahLainnya = () => {
    if (window.history.state?.sf) window.history.back()
    else openPemerintahTab('lainnya')
  }

  const openTab = (tab: DistributorTab) => {
    distributorNav.set(tab)
    setPage('dashboard')
  }

  const openPemerintahTab = (tab: PemerintahTab) => {
    pemerintahNav.set(tab)
    setPemerintahTab(tab)
    setPage(GOVERNMENT_PAGES[tab])
  }

  const handleLogin = (role: Role, name: string) => {
    session.set(role, name)
    setAuth({ role, name })
    if (role === 'pemerintah') {
      pemerintahNav.reset()
      setPemerintahTab('beranda')
    }
    setPage('dashboard')
  }

  const handleLogout = () => {
    session.clear()
    setAuth(null)
    setPage('dashboard')
  }

  if (!auth) return <Login onLogin={handleLogin} />

  return (
    <Layout
      role={auth.role}
      name={auth.name}
      activePage={page}
      onNavigate={navigate}
      onLogout={handleLogout}
      connectionStatus={connection}
    >
      {auth.role === 'pemerintah' && !(page in GOVERNMENT_SUB_TITLES) && <PemerintahTabBar activeTab={pemerintahTab} onChange={openPemerintahTab} />}
      {auth.role === 'distributor' && page in SUB_TITLES && <BackBar title={SUB_TITLES[page]} onBack={backToDashboard} />}
      {auth.role === 'pemerintah' && page in GOVERNMENT_SUB_TITLES && <BackBar title={GOVERNMENT_SUB_TITLES[page]} label="Kembali ke Lainnya" onBack={backToPemerintahLainnya} />}
      {page === 'lainnya' && auth.role === 'pemerintah' ? <PemerintahLainnya onNavigate={navigate} /> : <PageContent page={page} role={auth.role} onNavigate={navigate} />}
      {auth.role === 'distributor' && page in SUB_TITLES && <BottomNavDistributor activeTab="profil" onChange={openTab} />}
      {auth.role === 'pemerintah' && <BottomNavPemerintah activeTab={pemerintahTab} onChange={openPemerintahTab} />}
    </Layout>
  )
}
