import { shipmentStages } from '../data'
import { StatusBadge, getStatusFromSuhu } from './Status'

export default function FrostTraceTimeline({ accent = '#3b82f6' }: { accent?: string }) {
  return (
    <ol aria-label="Riwayat perjalanan" className="relative space-y-4 pl-6">
      <span className="absolute bottom-2 left-[7px] top-2 w-px" style={{ background: 'rgba(147,197,253,0.3)' }} />
      {shipmentStages.map((st) => (
        <li key={st.name} className="relative">
          <span
            className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full"
            style={{ background: st.done ? accent : 'transparent', border: `2px solid ${accent}` }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{st.name}</p>
            <StatusBadge status={getStatusFromSuhu(st.suhu)} size="sm" />
          </div>
          <p className="text-xs" style={{ color: '#93c1e0' }}>
            <span className="font-mono">{st.time}</span> · {st.lokasi} · <span className="font-mono">{st.suhu}°C</span>
            {!st.done && ' · menunggu'}
          </p>
        </li>
      ))}
    </ol>
  )
}
