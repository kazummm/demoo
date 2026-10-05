import sheet from '../assets/logo.jpeg'

const SHEET_W = 1536
const SHEET_H = 1024

interface Crop { x: number; y: number; w: number; h: number }

const CROPS = {
  icon: { x: 50, y: 405, w: 136, h: 136 },
  primary: { x: 30, y: 65, w: 530, h: 265 },
} satisfies Record<string, Crop>

interface Props {
  variant: keyof typeof CROPS
  width: number
  className?: string
  onDark?: boolean
  backdrop?: string
}

const FADE = 'radial-gradient(ellipse 72% 72% at 50% 50%, #000 62%, transparent 100%)'

export default function BrandLogo({ variant, width, className = '', onDark = false, backdrop = '#001f3f' }: Props) {
  const c = CROPS[variant]
  const k = width / c.w
  const sprite = (
    <div
      role="img"
      aria-label="SMART-FROST"
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${sheet})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${(SHEET_W / c.w) * 100}% auto`,
        backgroundPosition: `${(c.x / (SHEET_W - c.w)) * 100}% ${(c.y / (SHEET_H - c.h)) * 100}%`,
        ...(onDark && { filter: 'invert(1) hue-rotate(180deg) saturate(1.3)', mixBlendMode: 'screen' as const }),
      }}
    />
  )

  if (!onDark) {
    return (
      <div className={`flex-shrink-0 ${className}`} style={{ width, maxWidth: '100%', aspectRatio: `${c.w} / ${c.h}` }}>
        {sprite}
      </div>
    )
  }

  // Solid backdrop gives mix-blend-mode a surface inside the parent stacking context;
  // the mask fades the edges so the logo melts into the page background.
  return (
    <div
      className={`flex-shrink-0 ${className}`}
      style={{
        width,
        maxWidth: '100%',
        aspectRatio: `${c.w} / ${c.h}`,
        background: backdrop,
        isolation: 'isolate',
        WebkitMaskImage: FADE,
        maskImage: FADE,
      }}
    >
      {sprite}
    </div>
  )
}
