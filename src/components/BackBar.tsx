export default function BackBar({ title, label = 'Kembali ke Profil', onBack }: { title: string; label?: string; onBack: () => void }) {
  return (
    <div
      className="sticky top-0 z-20 -mx-4 -mt-4 mb-4 flex items-center gap-3 px-4 py-2 md:-mx-6 md:-mt-6 md:px-6"
      style={{ background: 'rgba(0,31,63,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(147,197,253,0.18)' }}
    >
      <button
        onClick={onBack}
        aria-label={label}
        className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl"
        style={{ color: '#93c5fd', border: '1px solid rgba(147,197,253,0.3)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <p className="truncate text-lg font-bold" style={{ color: 'var(--foreground)' }}>{title}</p>
    </div>
  )
}
