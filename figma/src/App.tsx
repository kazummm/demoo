import { useState } from 'react'
import type { Role } from './data'
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
  if (page === 'frosttrace') return <FrostTrace />
  if (page === 'perbandingan') return <PerbandinganLayar />
  if (page === 'registrasi-nelayan') return <RegistrasiNelayan onBack={() => onNavigate('dashboard')} />
  if (page === 'simulasi') return <Simulasi />
  if (page === 'riwayat') return <Riwayat />
  if (page === 'peta') return <PetaDistribusi />
  if (page === 'analisis') return <Analisis />
  if (page === 'konfirmasi') return <DashboardDistributor onNavigate={onNavigate} />
  if (page === 'laporan') return <Laporan />
  return <div style={{ color: '#64a0c8' }}>Halaman tidak ditemukan.</div>
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [page, setPage] = useState('dashboard')
  const [connection] = useState<'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED'>('ONLINE')

  const handleLogin = (role: Role, name: string) => {
    setAuth({ role, name })
    setPage('dashboard')
  }

  const handleLogout = () => {
    setAuth(null)
    setPage('dashboard')
  }

  if (!auth) return <Login onLogin={handleLogin} />

  return (
    <Layout
      role={auth.role}
      name={auth.name}
      activePage={page}
      onNavigate={setPage}
      onLogout={handleLogout}
      connectionStatus={connection}
    >
      <PageContent page={page} role={auth.role} onNavigate={setPage} />
    </Layout>
  )
}
