import { getStatusBadgeClass, getStatusColor, type Status } from '../data'

export type { Status } from '../data'

export const SUB_TEXT = '#93c1e0'

export function getStatusFromSuhu(suhu: number): Status {
  if (suhu <= 4) return 'AMAN'
  if (suhu <= 6) return 'WASPADA'
  return 'RISIKO'
}

export const STATUS_RANK: Record<Status, number> = { RISIKO: 0, WASPADA: 1, AMAN: 2 }

export function sortByExceptionFirst<T extends { status: Status }>(items: T[]): T[] {
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => STATUS_RANK[a.item.status] - STATUS_RANK[b.item.status] || a.i - b.i)
    .map((x) => x.item)
}

export const STATUS_META: Record<Status, { icon: 'check-circle' | 'triangle-alert' | 'octagon-x'; microcopy: string; color: string; cls: string }> = {
  AMAN: { icon: 'check-circle', microcopy: 'Suhu terjaga', color: getStatusColor('AMAN'), cls: getStatusBadgeClass('AMAN') },
  WASPADA: { icon: 'triangle-alert', microcopy: 'Periksa es & pendinginan', color: getStatusColor('WASPADA'), cls: getStatusBadgeClass('WASPADA') },
  RISIKO: { icon: 'octagon-x', microcopy: 'Tangani sekarang', color: getStatusColor('RISIKO'), cls: getStatusBadgeClass('RISIKO') },
}

export function StatusIcon({ status, size = 16, color }: { status: Status; size?: number; color?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color ?? 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'flex-shrink-0',
  }
  if (status === 'AMAN') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12.5l2.7 2.7L16 9.5" />
      </svg>
    )
  }
  if (status === 'WASPADA') {
    return (
      <svg {...common}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  )
}

export function StatusBadge({ status, size = 'md' }: { status: Status; size?: 'sm' | 'md' | 'lg' }) {
  const sizing = size === 'sm' ? 'gap-1 px-2 py-0.5 text-xs' : size === 'lg' ? 'gap-2 px-4 py-1.5 text-base' : 'gap-1.5 px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizing} ${STATUS_META[status].cls}`}>
      <StatusIcon status={status} size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
      {status}
    </span>
  )
}
