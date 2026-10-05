import { batches, alerts, type Role, type Batch } from './data'

let user: { role: Role; name: string } | null = null
let distributorReturnTab: string = 'beranda'
let pemerintahReturnTab: string = 'beranda'

export const session = {
  set(role: Role, name: string) {
    user = { role, name }
  },
  clear() {
    user = null
  },
  name: () => user?.name ?? '',
  role: () => user?.role ?? null,
}

export const distributorNav = {
  peek: () => distributorReturnTab,
  set(tab: string) {
    distributorReturnTab = tab
  },
  reset() {
    distributorReturnTab = 'beranda'
  },
}

export const pemerintahNav = {
  peek: () => pemerintahReturnTab,
  set(tab: string) {
    pemerintahReturnTab = tab
  },
  reset() {
    pemerintahReturnTab = 'beranda'
  },
}

export function visibleBatches(): Batch[] {
  return user?.role === 'distributor' ? batches.filter((b) => b.distributor === user!.name) : batches
}

export function visibleAlerts() {
  if (user?.role !== 'distributor') return alerts
  const ids = new Set(visibleBatches().map((b) => b.id))
  return alerts.filter((a) => ids.has(a.batch))
}
