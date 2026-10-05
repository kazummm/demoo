interface Props {
  value: string
  size?: number
  inverted?: boolean
}

// Deterministic hash so the same batch ID always renders the same QR pattern
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

function seededBit(seed: number, row: number, col: number): boolean {
  const v = hash(String(seed ^ (row * 31 + col * 7)))
  return v % 3 !== 0
}

export default function QrMock({ value, size = 120, inverted = false }: Props) {
  const modules = 21
  const padding = 3
  const totalSize = modules + padding * 2
  const cellSize = size / totalSize

  const seed = hash(value || "SMART-FROST")

  const bg = inverted ? "#001f3f" : "#ffffff"
  const fg = inverted ? "#06b6d4" : "#000000"

  // Finder pattern: top-left, top-right, bottom-left
  const finderCells = new Set<string>()
  const finderOrigins = [[0, 0], [0, 14], [14, 0]] as const

  for (const [or, oc] of finderOrigins) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inOuter = r === -1 || r === 7 || c === -1 || c === 7
        const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        const isWhite = !inOuter && !inInner && !(r === 0 || r === 6 || c === 0 || c === 6)
        if (r >= 0 && r < 7 && c >= 0 && c < 7) {
          finderCells.add(`${or + r},${oc + c}`)
          if (isWhite) finderCells.add(`white:${or + r},${oc + c}`)
        }
      }
    }
  }

  const cells: { r: number; c: number; fill: boolean }[] = []

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const key = `${r},${c}`
      if (finderCells.has(`white:${key}`)) {
        cells.push({ r, c, fill: false })
      } else if (finderCells.has(key)) {
        cells.push({ r, c, fill: true })
      } else if (r === 6 || c === 6) {
        // Timing pattern
        cells.push({ r, c, fill: (r + c) % 2 === 0 })
      } else if (r >= 8 && c >= 8) {
        cells.push({ r, c, fill: seededBit(seed, r, c) })
      }
    }
  }

  const x = (c: number) => (c + padding) * cellSize
  const y = (r: number) => (r + padding) * cellSize

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", flexShrink: 0 }}
      aria-label={`QR code for batch ${value}`}
    >
      <rect width={size} height={size} fill={bg} rx={4} />
      {cells.map(({ r, c, fill }) =>
        fill ? (
          <rect
            key={`${r}-${c}`}
            x={x(c)}
            y={y(r)}
            width={cellSize}
            height={cellSize}
            fill={fg}
          />
        ) : null
      )}
    </svg>
  )
}
