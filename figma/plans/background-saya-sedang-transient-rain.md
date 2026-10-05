# SMART-FROST — Login redesign, design system, then Plan D Pass 1

## Context
Improve the existing mobile prototype (not a new app). Keep the dark navy/cyan identity, cold-chain feel, and role-based login. First priority is the Login page; then apply one consistent design system to all other screens without removing features or changing flows. Plan D Pass 1 (plans/background-saya-sedang-fluffy-river.md) stays in scope and is built after/alongside, since it touches Layout, Monitoring, DashboardNelayan, App.

## Phase 1 — Design tokens (`src/index.css`)
- Keep Outfit + JetBrains Mono. Add utility classes in `@layer components`: `.btn-primary` (min-h 48px, cyan gradient, disabled/loading states), `.btn-secondary`, `.input-field` (min-h 48px, 16px text, visible focus ring, `.is-error` state, disabled state), `.card`, `.label`, `.helper-text`.
- Raise muted text contrast (#64a0c8 -> ~#8fb8d6; footer #2d5a7a -> ~#6f98b8). Minimum body/helper text 14px, labels 14px/500, placeholder ~#6f98b8.
- Add `prefers-reduced-motion` guard and `:focus-visible` ring.

## Phase 2 — Login (`src/pages/Login.tsx`, `src/components/BrandLogo.tsx`)
- Logo: fix the black-box look (jpeg sheet, no alpha). Use `mix-blend-mode: screen` on a transparent wrapper with a radial mask/fade so edges blend into the background; size ~200px on mobile (responsive, `max-w-full`). Verify visually; if still boxy, fall back to the icon crop + text wordmark.
- Header hierarchy: logo -> "SMART-FROST" (h1, 28px bold) -> tagline (mono, cyan, 14px) -> intro sentence (16px). Tighter spacing scale (8/16/24).
- Remove glow orbs; keep a faint low-opacity grid only. Layout `min-h-dvh`, top-aligned on small screens, `px-4`, card `p-6`, `space-y-5`.
- Form: 48px inputs, explicit `htmlFor`/`id`, `autoComplete`, `inputMode`, show/hide password toggle, role as 3 segmented radio buttons (replaces `<select>`), inline error with `aria-live` and red border on inputs.
- States: normal, focus (cyan ring), error, loading (spinner + "Memproses…", ~600ms simulated delay before `onLogin`), disabled (submit disabled while empty/loading).
- Demo accounts: section "Akun demo" with 3 chips tied to the role segmented control; selected chip highlighted with check icon; after click show confirmation "Data login peran Nelayan terisi otomatis" (`role="status"`). Role control and chips stay in sync.
- Footer text 12px -> 13px with higher contrast. Indonesian copy throughout.

## Phase 3 — Apply system to other screens
- `src/components/Layout.tsx`: header/sidebar use shared tokens, 44px touch targets, consistent icon size (20px stroke), connection indicator ("Terhubung / Offline / Sinkronisasi") using `.badge-online/offline/syncing`; mobile drawer behavior preserved.
- Pages (Dashboard x3, Monitoring, FrostScore, FrostTrace, Pengiriman, Peringatan, Device, RegistrasiBatch, PetaDistribusi, Analisis, Simulasi, Riwayat, Laporan): replace ad-hoc inline buttons/inputs/cards with the shared classes, unify radius (12px cards, 10px controls), spacing, min text size 12px (secondary) / 14px (body), Indonesian labels. No logic, routes, or data changes.

## Phase 4 — Plan D Pass 1
1. `src/components/Status.tsx`: `getStatusFromSuhu`, `sortByExceptionFirst`, `StatusBadge` (uses `getStatusBadgeClass` from data.ts).
2. `Layout.tsx`: fixed bottom nav for nelayan (dashboard, monitoring, peringatan, riwayat) + `pb-20`.
3. `Monitoring.tsx`: `role` prop; simplified nelayan view (locked FR-001, single suhu card + StatusBadge, chart h180, keep anomaly banner, no legend/selector/stat grid).
4. `src/components/AlertCard.tsx` extracted from DashboardNelayan with prescriptive button text.
5. `App.tsx`: pass `role` to Monitoring.

## Verification
- Run dev server, view at ~360px and 390px width: no clipped text/overlap on Login; test all states (empty/disabled, focus, wrong password error, loading, demo chip fill).
- Log in as each role (`nelayan@/distributor@/pemerintah@smartfrost.id`, pw `demo123`) and click through every page for visual consistency and no regressions.
- `npx tsc --noEmit` passes.

---

# Addendum — Side-by-side Normal vs Alert dashboard screens

## Context
New request: show two mobile dashboard screens side by side. Screen 1 Normal: 2.8°C, score 95/100 ring, green "Sistem Stabil" badge, no Add Ice button. Screen 2 Alert: 4.2°C bold, score 65/100 red ring, red blinking "Tindakan Diperlukan" badge, full-width cyan "Tambah Es" button. Navy #001F3F, sans labels, mono numbers. Current state: `DashboardNelayan` has one live screen driven by a scenario toggle, using `StatusCard` (ring via `FrostRing`), `StatusBadge`, sticky "Tambah Es" button.

## Approach (reuse, do not duplicate)
1. `src/components/StatusCard.tsx`: export a presentational `DashboardScreen` (or keep `StatusCard` and add a thin `PhoneFrame`) so the same markup renders both states from props: `suhu`, `score`, `status`, `showAddIce`. Normal: hide Add Ice; Alert: show it. Score color via `getFrostScoreCategory` (95 -> green, 65 -> red/amber per existing thresholds; 65 falls in "Waspada" amber, so pass explicit red `#ef4444` override for the alert screen as requested).
2. Status badge text: "Sistem Stabil" (green, `badge-aman`) vs "Tindakan Diperlukan" (red, `badge-risiko` + `animate-pulse`/blink; respect existing reduced-motion guard).
3. New page `src/pages/PerbandinganLayar.tsx` (default export): two 390px-wide phone frames in a flex row (`flex-wrap`, gap-8, scroll on narrow viewports), each with cold-grid background, header + connection badge, status card, and (alert only) sticky-in-frame full-width cyan Add Ice button; include mini bottom nav reusing `bottomNav` items (export from `Layout.tsx`).
4. Wire as a view reachable without removing anything: add nav id `perbandingan` ("Perbandingan Layar") to `nelayanNav` in `Layout.tsx` and a route line in `PageContent` in `src/App.tsx`.
5. Layout uses flex/grid (Auto Layout equivalent); fonts stay Outfit + JetBrains Mono; radius 16/8 per existing tokens.

## Verification
- Login as nelayan, open "Perbandingan Layar": two frames render side by side with correct values, Add Ice only on the right.
- Resize to ~390px: frames stack without clipping.
- `npx tsc --noEmit` passes; existing dashboard still works.

## Open question
None blocking; default is a new page rather than altering the live dashboard.

---

# Addendum 2 — Redesign "Daftarkan Batch Ikan" (RegistrasiBatch)

## Context
Existing `src/pages/RegistrasiBatch.tsx` is a desktop-style 2-column form with 12px text, old #061220 inputs, a fake decorative QR, and no back button. Redesign for 360-390px: card-grouped form, dedicated success view with real-looking black-on-white QR. It is reached from the Nelayan dashboard scan button (`onNavigate('registrasi')`) and the sidebar; keep that route id and all 9 existing fields/state logic (`FormData`, `initial`, `set`, `submit`).

## Changes
1. `src/components/QrMock.tsx` (new): move `QrMock` out of `src/pages/DashboardNelayan.tsx` (not exported today), export default, import it back in the dashboard. Reuse for the success view (black modules on white, seeded by batch ID).
2. `src/pages/RegistrasiBatch.tsx`: add `onBack: () => void` prop; `App.tsx` passes `() => onNavigate('dashboard')` (line `if (page === 'registrasi')`).
   - Header: 44px back button + h1 "Daftarkan Batch Ikan".
   - Three `.card` groups (16px radius, existing glass token), 24px gap: **Data Ikan** (Jenis Ikan select, Berat kg, Tanggal Pengiriman?) no - Data Ikan: Jenis Ikan, Berat (kg); **Logistik**: Asal, Tujuan, Distributor, Tanggal Pengiriman; **Identitas**: ID Batch, Nama Nelayan, Nomor/Nama Kapal.
   - Inputs via `.input-field` + `.label` (48px, 10px radius override `rounded-[10px]`, 16px text, labels 14px above, `htmlFor`/`id`), JetBrains Mono for values (`font-mono`), select styled the same; numeric fields `inputMode="decimal"`.
   - Submit "Simpan & Buat QR" uses the only cyan: add `.btn-cyan` (solid #00FFFF, dark text, 10px radius, min-h 48px) in `src/index.css`; no other element uses #00FFFF.
   - Success view (replaces form when `saved`): status check icon + "Batch berhasil didaftarkan", white rounded tile with `QrMock` (black on white, ~220px, max-w full), mono batch ID, summary list (Jenis, Berat, Rute, Kapal; 14px+), buttons stacked full-width: "Unduh QR" (`.btn-cyan`; downloads the QR SVG via Blob/`<a download>` as `QR-<id>.svg`) and "Buat Batch Baru" (`.btn-cyan` too per "two primary buttons"; resets `form` to `initial`, `saved` false).
   - Remove `text-xs`/`text-sm` below 14px; all touch targets >= 44px; container `mx-auto max-w-md`, `px` from Layout (p-4 on mobile), verified at 360 and 390.
3. No data.ts changes; no new routes.

## Verification
- `npx tsc --noEmit` (needs Bash permission) and view at 360px and 390px: no horizontal scroll, text >= 14px.
- Fill form -> success view shows QR + summary; "Unduh QR" downloads SVG; "Buat Batch Baru" returns to empty form; back button returns to dashboard.
- Dashboard QR sheet still renders after QrMock extraction.
