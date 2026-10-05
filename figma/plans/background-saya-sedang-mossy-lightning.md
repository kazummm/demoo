# BottomNavDistributor restyle (dark #0f172a, floating Scan)

## Context
The user re-specified `BottomNavDistributor.tsx`. The last pass made the bar light (#f1f6fd) with #1e3a8a active color; this new spec reverts to a dark bar with bright blue accents. The component already exists with the right structure (5 tabs, Nelayan icons from `Layout.tsx`, raised Scan button, `activeTab`/`onChange` props, `md:hidden`), so this is a focused restyle, not a rewrite. The older Plan D content in this file is superseded for this task.

## Changes (only two files)

### `src/components/BottomNavDistributor.tsx`
- Colors: `BAR = '#0f172a'`, `ACTIVE = '#3b82f6'`, `INACTIVE = '#64748b'`. Remove the `FAB` constant.
- `<nav>`: `z-50` (was `z-40`), background `BAR`, keep `fixed inset-x-0 bottom-0 md:hidden`, keep safe-area padding, soft top border and upward shadow.
- Tab buttons: icon and label both take `ACTIVE`/`INACTIVE`; label `text-[10px]`; add `transition-colors duration-200` on the button and `transition-transform` on the icon (active icon `scale-110`) for smooth switching; keep the thin top indicator but use `ACTIVE` with a fade transition (render always, toggle opacity).
- Scan: keep the `absolute -top-7 h-16 w-16` circle (floating above the bar) but make the fill the same gradient as the "Scan QR Batch" button: `linear-gradient(135deg, #60a5fa, #3b82f6 55%, #1d4ed8)`, border `4px solid BAR`, blue glow shadow, `transition-transform active:scale-95`. Label "Scan" at 10px, colored by active state.
- Icons unchanged (`IconDashboard`, `IconBatch`, `IconScan`, `IconHistory`, person SVG).

### `src/pages/DashboardDistributor.tsx`
- Root container is already `pb-20 md:pb-0` (= 80px); keep it.
- Scan tab: the pinned "Konfirmasi" button currently uses `#1e3a8a` and sits at `bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30`. Switch it to the shared `primaryBtn` gradient so it matches the dark theme, and keep it below `z-50` so the nav stays on top. The extra `pb-24` on the scan section stays so content isn't covered.
- The detail `Modal` is `z-50` and rendered after the nav in the DOM, so it still overlays the nav; no change needed.

## Verification
- `npx tsc --noEmit 2>&1 | grep -v "^npm"` (empty output = clean).
- Dev server at ~390px as distributor: confirm the bar is #0f172a, Scan floats above it with the blue gradient, the active tab is #3b82f6 with inactive #64748b, labels are 10px, tab switches animate, and content clears the bar by 80px. The dev server wasn't reachable from the shell before, so if it still isn't, say explicitly that the visual check wasn't done.
