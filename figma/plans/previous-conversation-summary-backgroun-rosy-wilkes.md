# Plan D (new): Role-wide UI refinement (Nelayan / Distributor / Pemerintah) + consistent status system

## USER REVISIONS (override anything below that conflicts)
**Execution:** three separate passes (1 Status+Nelayan, 2 Distributor, 3 Pemerintah). After EACH pass run `npx tsc --noEmit` (ask for Bash permission if denied) and STOP for user review. Do not edit `data.ts` values, routes, role structure, main colors, navy theme, icon sidebar, Indonesian content.

**`src/components/Status.tsx`** exports: `type Status`, `STATUS_META`, `StatusIcon`, `StatusBadge`, `getStatusFromSuhu`, `STATUS_RANK`, `sortByExceptionFirst`.
- ONE rule everywhere: `AMAN` suhu <= 4; `WASPADA` 4 < suhu <= 6; `RISIKO` suhu > 6. Use `getStatusFromSuhu(suhu)` wherever a suhu is available (never hardcoded label). Replaces Monitoring's old 5-degree rule; update all legends/threshold copy ("4-6 C", "> 6 C"), Monitoring/Peringatan threshold cards, chart reference lines (4 and 6).
- Sanity check vs. sample data: FR-001 2.8 AMAN, FR-002 5.7 WASPADA, FR-003 1.9 AMAN, FR-004 6.2 RISIKO; alerts 5.7 / 6.2 / 4.2 -> WASPADA / RISIKO / WASPADA; tempHistory 13:00 4.2 and 14:00 4.8 WASPADA. All consistent, so FR-002 is WASPADA everywhere (data.ts `status` fields untouched but no longer used for rendering when suhu exists).
- `STATUS_META` microcopy: AMAN icon check-circle "Suhu terjaga"; WASPADA triangle-alert "Periksa es & pendinginan"; RISIKO octagon-x "Tangani sekarang". Existing badge colors, icon + text always.
- Replace ad hoc `getStatusBadgeClass`/`getStatusColor` rendering with `StatusBadge` in: DashboardNelayan, DashboardDistributor, DashboardPemerintah, Monitoring, Peringatan, FrostTrace, PetaDistribusi, Laporan, Pengiriman, Riwayat, FrostScore (where present). Non-badge uses of color (chart strokes) may still use `STATUS_META[...].color`.

**Pass 1 (Status + Nelayan):** Status.tsx; Nelayan home = one Hero Card (gauge, "Kondisi Ikan: Sangat Baik", large Suhu + Durasi inline, ONLINE/OFFLINE pill, one `AlertCard`, CTA "Scan Batch Baru (QR)" >=56px, secondary 48px text button "Tampilkan QR Batch"); fixed bottom nav for nelayan only (Beranda, Peringatan, raised center Scan QR h-14/h-16 cyan -> `registrasi`); Monitoring gets `role` from `App.tsx` `PageContent` - nelayan default = big Suhu + StatusBadge, Status Kondisi + microcopy, short lokasi, Durasi, small "Detail Teknis" toggle revealing Min/Maks/Rata-rata, GPS, full chart, threshold legend, AI banner; distributor/pemerintah keep full technical view; `AlertCard` = header `[StatusIcon STATUS] · [ID]`, sentence 1 condition, sentence 2 action, one 48px "Sudah Ditindak" -> "Tercatat {waktu}"; nelayan hides long AI paragraph, compact threshold chips. Nelayan controls >=48px, secondary text `SUB_TEXT = '#93c1e0'`. Peringatan uses `AlertCard` + StatusBadge (all roles get the new status system; long AI text only hidden for nelayan).
- Pass 1 also swaps StatusBadge into the shared pages (Pengiriman, Riwayat, FrostScore, Monitoring, Peringatan) since the rule must be consistent from the start; Distributor/Pemerintah-specific layout changes wait for passes 2-3 (their dashboards only get StatusBadge/rule swap in pass 1 if they render status).

**Pass 2 (Distributor):** `sortByExceptionFirst` on batches (ranked by `getStatusFromSuhu`); card = ID, jenis+berat, rute, suhu, FrostScore, StatusBadge, "Terima Batch"; first tap -> inline "Terima {id}?" (WASPADA/RISIKO add "Batch ini {status} - periksa sebelum menerima"), buttons [Batal] [Ya, Terima], confirmed -> "DITERIMA". FrostTrace: header "Tahap {done} dari {total}" + segmented progress bar, each stage shows StatusBadge (from stage suhu), waktu, lokasi, suhu; "Tampilkan QR" moved into progress header, existing QR panel kept.

**Pass 3 (Pemerintah):** Dashboard 4 KPIs only (Total Pengiriman, Aktif, Waspada/Risiko with sub "5 waspada · 2 risiko", Avg FrostScore); move Selesai, Avg Suhu, Total Peringatan, Avg Durasi to Analisis. Analisis: ReferenceAreas + ReferenceLines at 4 and 6; points outside AMAN drawn as enlarged colored dots by `getStatusFromSuhu`; legend "Aman / Waspada / Risiko" only (no generic "Anomali" label); FrostScore chart reference lines 75 and 60. PetaDistribusi: lighter palette, larger markers with status glyph, batch label pills, summary chips + legend; NO invented named geographic clusters - group routes only by the existing location labels (e.g. origin -> destination legs already in the file) or neutral "rute aktif" grouping. Laporan: BrandLogo + "Dinas Kelautan Pangkep", periode, Ringkasan Eksekutif, Rekomendasi Tindakan, Data Batch with StatusBadge, dashed Mode Simulasi callout, footer "SMART-FROST · GEMASTIK 2026"; "Unduh PDF" -> `window.print()` + `@media print` CSS in `src/index.css`.

**Global acceptance:** no un-iconed status badge anywhere; Nelayan buttons/selects/toggles >=48px, primary CTA >=56px; verify all three roles at ~390px and desktop.

(The original detailed Plan D below is the reference for layout details; where it says "route clusters" or "Anomali", the revisions above win.)

## Context
Refine the UI without touching sample data (`src/data.ts`), role structure, main colors, feature content, dark navy theme, icon sidebar, or Indonesian copy. Nelayan gets Field-First/Passive Monitoring (simple home, bottom nav, simplified Monitoring, prescriptive alerts, bigger tap targets, higher-contrast secondary text). Distributor gets exception-first batches and a FrostTrace progress view. Pemerintah gets a focused KPI dashboard, a readable map, thresholds on analysis charts, and a presentation-ready report. AMAN/WASPADA/RISIKO must look/read identically everywhere.

## Findings (files read)
- `Layout.tsx`: sidebar (collapsed by default) + sticky top bar + `<main class="p-6">`; nav arrays per role; `App.tsx` `PageContent` renders pages (only dashboards receive `onNavigate`; `Monitoring`/`Peringatan` take no props).
- Status is rendered ad hoc via `getStatusBadgeClass` / `getStatusColor` in ~8 pages, with mixed emoji icons and no consistent icon per status. Monitoring has its own `getStatus(suhu)` (<=4 AMAN, <=5 WASPADA, else RISIKO).
- Existing reusable pieces: `getStatusColor`, `getFrostScoreCategory`, `.badge-aman/.badge-waspada/.badge-risiko` in `src/index.css`, `BrandLogo`, QR mock in `DashboardNelayan.tsx`, FrostTrace `showQR` toggle, Analisis recharts setup.

## Step 0 - Shared status system (new `src/components/Status.tsx`)
- `STATUS_META: Record<Status, {label, color, icon, micro}>`: AMAN = check-circle + "Suhu terjaga", WASPADA = triangle-alert + "Periksa pendinginan", RISIKO = octagon-x + "Tangani sekarang". Colors from `getStatusColor` (unchanged hex).
- `StatusIcon`, `StatusBadge` (icon + uppercase label, uses existing `.badge-*` classes), `STATUS_RANK` (RISIKO 0, WASPADA 1, AMAN 2) and `sortByExceptionFirst()`.
- `SUB_TEXT = '#93c1e0'` higher-contrast secondary text used on Nelayan screens (main `#64a0c8` tokens untouched elsewhere).
- Replace `getStatusBadgeClass` spans with `<StatusBadge>` in: DashboardNelayan, DashboardDistributor, FrostTrace, Monitoring, Peringatan, PetaDistribusi, Laporan, and any of Pengiriman/Riwayat/FrostScore that use it (grep).
- Move `AlertCard` here too (see Nelayan step 4).

## Nelayan
1. **Home (`DashboardNelayan.tsx`)**: one Hero Card containing gauge + FrostScore 92, "Kondisi Ikan: Sangat Baik", Suhu utama (2.8 C) and Durasi as large inline metrics; header keeps ONLINE/OFFLINE pill + sync line; one `AlertCard`; primary CTA "Scan Batch Baru (QR)"; "Tampilkan QR Batch" demoted to a 48px text-style button. Remove the separate Suhu/Durasi tile row (merged into hero).
2. **Bottom nav (`Layout.tsx`)**: for `role==='nelayan'` render persistent fixed bottom bar with 3 items - Beranda (`dashboard`), Peringatan (`peringatan`), Scan QR (`registrasi`). Scan QR is a raised center cyan button (h-14+ = 56dp, gradient, glow); others min 48px targets with icon + label; active state uses cyan. Add `pb-28` to main content; hide nelayan sidebar below `md` (kept from `md` up); other roles unchanged. Badge dot on Peringatan when alerts exist.
3. **Monitoring (`Monitoring.tsx`)**: add `role` prop (pass from `App.tsx` `PageContent`). For nelayan default view = Suhu Saat Ini (large, status colored + StatusBadge), Status Kondisi + micro text, Lokasi singkat ("Selat Makassar"), Durasi, optional mini chart behind a "Lihat Grafik" toggle (small 120px sparkline). A "Detail Teknis" toggle (48px) reveals Min/Maks/Rata-rata, GPS coordinates, full chart, threshold legend, AI banner. Distributor/Pemerintah keep the current full view (technical mode default open).
4. **Alerts (`Peringatan.tsx` + `AlertCard`)**: card format `[StatusIcon STATUS] [ID BATCH]` header, sentence 1 = condition ("Suhu {suhu}C di {lokasi}."), sentence 2 = action ("Tindakan: tambahkan es balok segera." for RISIKO/WASPADA), one small "Sudah Ditindak" button (min 48px, local `useState` per alert id, swaps to "Tercatat {waktu}"). Nelayan variant hides the long AI paragraph and shows compact threshold chips; other roles keep existing layout but use `StatusBadge`. Home reuses the same `AlertCard` with the top alert.
5. Global for Nelayan pages: all buttons/select/toggles >=48px tall, secondary text -> `SUB_TEXT`, no paragraphs over ~1 line.

## Distributor
- `DashboardDistributor.tsx`: sort batches with `sortByExceptionFirst` (FR-004 RISIKO, FR-002 WASPADA, then AMAN FR-001/003; stable). Batch card: ID, jenis+berat, rute (asal -> tujuan), suhu, FrostScore (+label), `StatusBadge`, action "Terima Batch". Safe confirmation: first tap turns the button row into "Terima {id}?" with [Ya, Terima] / [Batal] (RISIKO/WASPADA show one extra line "Batch ini {status} - periksa sebelum menerima"); confirmed state shows "DITERIMA". Keep stats and alert list (use `StatusBadge`). Also serves `konfirmasi` route.
- `FrostTrace.tsx`: add progress header "Tahap {done count} dari {shipmentStages.length}" (= Tahap 5 dari 8) with segmented progress bar; each stage shows status via `StatusBadge`, time, lokasi, suhu; "Tampilkan QR" button moved into the progress header (min 48px), reuse existing QR panel.

## Pemerintah
- `DashboardPemerintah.tsx`: KPI row limited to 4: Total Pengiriman (120), Aktif (15), Waspada/Risiko (7, sub "5 waspada - 2 risiko" with status icons), Avg FrostScore (84). Remove Selesai and the second averages row; keep monthly chart + quick actions.
- `Analisis.tsx`: add the moved KPIs (Selesai, Avg Suhu, Total Peringatan, Avg Durasi) to the summary grid; temp-trend chart gets `ReferenceArea` bands (0-4 aman, 4-5 waspada, >5 risiko) + labeled `ReferenceLine`s at 4 and 5, custom dot that enlarges and recolors anomalies (suhu > 4, i.e. 13:00 and 14:00) with an "Anomali" legend chip; FrostScore trend gets lines at 75 and 60 (`getFrostScoreCategory` thresholds); pie legend uses `StatusBadge` icons.
- `PetaDistribusi.tsx`: lighter map palette (sea `#cfe8f7`-ish, land soft sand/green, dark label text), markers r 10 -> 16 with status glyph inside and batch label pill, summary chips above the map (counts from `batches`: AMAN 2 / WASPADA 1 / RISIKO 1 via `StatusBadge`), legend with icons, route clusters (group `routes` into 3 named clusters - "Pangkep-Makassar", "Kepulauan-Selat", "Darat Segeri" - drawn thicker with cluster labels and soft shaded corridor), keep DATA SIMULASI chip and list below.
- `Laporan.tsx`: presentation layout - institutional header (BrandLogo icon + "Dinas Kelautan Pangkep", title), periode "1-31 Agustus 2026", Ringkasan Eksekutif (KPI grid + 2-3 sentence narrative from `govStats`), Rekomendasi Tindakan (3 numbered items tied to `problemLocations`: Selat Makassar, Pelabuhan Pangkajene, Cold Storage), Data Batch (rows with `StatusBadge`), Catatan Mode Simulasi (dashed callout), footer "SMART-FROST - GEMASTIK 2026"; "Unduh PDF" calls `window.print()` with a small `@media print` block in `src/index.css`.

## Guardrails
- No edits to `data.ts` values; sidebar icon nav, role nav arrays (except already-removed nelayan items) and colors stay. Note for user: FR-002 (5.7 C) is labeled WASPADA in data but Monitoring thresholds would call it RISIKO - left as is.

## Verification
- `npx tsc --noEmit` (needs Bash permission - ask user if denied again) and check dev preview.
- Walk all three roles at ~390px and desktop: nelayan bottom nav (3 items, Scan QR raised and navigates to Registrasi), Monitoring default vs Detail Teknis, alert "Sudah Ditindak"; distributor order RISIKO->WASPADA->AMAN, confirm flow, "Tahap 5 dari 8"; pemerintah 4 KPIs, map legend/summary/clusters, threshold bands and anomaly markers, Laporan sections + footer; grep that no page still shows an un-iconed status badge.

---

# Plan C (done): Simplify Nelayan dashboard to "Field-First / Passive Monitoring"

## Context
Per the user's feature map, the Nelayan account must lose dense/technical features (batch table, FrostTrace, manual Device setup, redundant "Monitoring Suhu" shortcut, complex trend charts) and keep/enhance: FrostScore hero, Suhu + Durasi, alert with confirm button, offline/auto-sync status, and the primary "Scan Batch Baru (QR)" CTA. Add a secondary "Tampilkan QR Batch" button so a distributor can scan on arrival.

## Findings
- `src/pages/DashboardNelayan.tsx` already has header/connection pill, hero gauge, Suhu/Durasi, alert + acknowledge, CTA. Still contains: device info row, "Aksi Cepat" grid (Registrasi, Aktifkan Device, Monitoring Suhu, FrostTrace), and the "BATCH AKTIF ANDA" table (lines ~200-end). No trend chart exists on this page.
- `src/components/Layout.tsx` `nelayanNav` (lines 57-68) still lists `device` and `frosttrace`; distributor/pemerintah navs must stay unchanged. Routes in `src/App.tsx` stay (other roles use FrostTrace).
- No QR library installed; batch QR will be a deterministic mock QR-style SVG (grid of squares seeded from `batch.id`, plus 3 finder squares) - no new dependency.

## Changes
1. `DashboardNelayan.tsx`
   - Delete: batch table block, "Aksi Cepat" grid, device info row. Move the useful bits (batch id, jenis, rute) into the hero header line only.
   - Switch to single column: drop the `lg:grid-cols-2` wrapper, keep `max-w-md mx-auto` (allow `lg:max-w-lg`).
   - Order: header + sync status -> hero (gauge, "AMAN - Sangat Baik" badge, batch id/jenis) -> Suhu/Durasi -> alert box (only if `latestAlert` status != AMAN; keep text "Suhu naik {suhu}°C - Tindakan: Tambahkan es balok segera." and big confirm button) -> CTA "Scan Batch Baru (QR)" (h-16, primary) -> secondary outlined button "Tampilkan QR Batch" (h-14).
   - Secondary button opens a local bottom-sheet/modal (`useState<boolean>`): white QR panel (mock SVG seeded by `batch.id`), caption "{batch.id} - {batch.jenis} - {batch.berat} kg", "Tunjukkan ke distributor saat tiba di dermaga", large "Tutup" button (h-12), backdrop click closes.
   - Add a tiny local `QrMock` component (inside the file) to render the SVG.
2. `Layout.tsx`: remove `device` and `frosttrace` entries from `nelayanNav` only. Keep Monitoring nav (only its dashboard shortcut is removed).
3. No changes to `App.tsx` routing or data files.

## Verification
- Ask user to allow `npx tsc --noEmit` (Bash was denied earlier), or verify via preview.
- Preview as nelayan (`nelayan@smartfrost.id` / `demo123`) at ~390px: no table, no Aksi Cepat, no FrostTrace/Device in sidebar; both buttons visible without scrolling far; QR sheet opens/closes; alert confirm still toggles; distributor/pemerintah sidebars unchanged.

---

# Plan A (done): Insert user's SMART-FROST logo into the app

## Context
User attached their logo (attachment `22118962-d60a-4bfa-90fe-8c43db4f4fb9`) and wants it used in the app. Role = "content to use": embed the actual asset, do not redraw it. Currently a placeholder gradient square with a white shield SVG is used in two places.

## Steps
1. Fetch the asset into the project (not /tmp): `figma attachments get 22118962-d60a-4bfa-90fe-8c43db4f4fb9 --dest src/assets/logo.<ext>` (create `src/assets/`; existing `src/imports/` holds only pasted files). Then view it with Read to check ext, transparency, and whether it contains the wordmark or only the mark, and whether it reads on navy (#0a1e38 / #061220).
2. Import in Vite style (`import logo from '../assets/logo.png'`) in:
   - `src/components/Layout.tsx` lines 127-131: replace the 32px gradient box + shield SVG with `<img src={logo} alt="SMART-FROST" className="w-8 h-8 object-contain flex-shrink-0" />`. Keep the text block and collapse toggle. If the logo already includes the wordmark, drop the duplicate "SMART-FROST" text when expanded.
   - `src/pages/Login.tsx` lines 49-54: replace the 48px gradient box + SVG with a larger `<img>` (~h-14). Keep the title/tagline.
3. Favicon: add `<link rel="icon" href="/logo.png">` in `index.html` head (copy asset to `public/` too) and set the title text only if `figma:title` placeholder allows; otherwise skip.
4. If the logo is dark-on-transparent and unreadable on navy, wrap it in a white/rounded-lg chip rather than editing the image.

## Verification
- Preview the Login page and the sidebar (collapsed and expanded): logo crisp, not stretched, aligned with text; no broken image.

---

# Plan B (already implemented): Redesign DashboardNelayan (mobile-first, minimalist action-oriented)

## Context
`src/pages/DashboardNelayan.tsx` (131 lines) is a desktop-style dashboard (title, batch banner, 4 stat cards, alert, quick-action grid, batch table). The UX report calls for a field-first layout for fishermen: dynamic vessel header, large FrostScore hero with dynamic color, 2-col quick stats (Suhu, Durasi), a full-width "Scan Batch Baru (QR)" button, smart alert banner with action, and offline/sync status. Existing content stays below, and the navy/cyan theme (`src/index.css` tokens, inline hex styles, `.badge-*` classes) is kept.

## Findings
- Only file to change: `src/pages/DashboardNelayan.tsx`. Props: `onNavigate(page)`; pages available: `registrasi`, `device`, `monitoring`, `frosttrace`.
- Data from `src/data.ts`: `batches[0]` (kapal "KM Cahaya Laut", suhu 2.8, frostScore 92), `alerts[2]` (FR-001 WASPADA, 4.2°C), `getFrostScoreCategory` (>=90 green, >=75 blue, >=60 yellow, else red), `getStatusBadgeClass`.
- No duration field exists: derive mock elapsed time from `shipmentStages[0].time` ("06:00") to a fixed "now" (e.g. 10:20 -> "4j 20m"), computed in a small local helper.
- Fonts (Outfit / JetBrains Mono) and `.font-mono` already wired; no CSS changes required.

## Changes (single file, keep default export and `Props`)
1. **Header**: left = vessel `batch.kapal` + "Nelayan · {batch.nelayan}"; right = connection pill (cloud icon, local `useState<'online'|'offline'|'syncing'>`, reusing `.badge-online/.badge-offline/.badge-syncing`). Status text under header: "Sinkronisasi selesai" / "Data tersimpan lokal (Offline)" / "Menyinkronkan..." with a thin progress bar when syncing. Small toggle (tap the pill) cycles states for demo.
2. **Hero FrostScore**: rounded-3xl card, tinted background + top border using `scoreColor`; half-circle SVG gauge (arc with dash offset by score), big number (text-7xl, mono), label "Kondisi Ikan: {scoreLabel}" plus batch id/jenis line.
3. **Quick stats**: 2-col grid; Suhu (thermometer icon, `{suhu}°C`, cyan) and Durasi (clock icon, `4j 20m`), values text-3xl for sunlight legibility.
4. **Smart alert banner** (below hero, from `alerts[2]`): color by status, message + instruction ("Tambahkan es balok"), button "Saya Sudah Tindak Lanjut" (min h-12) that sets local `acknowledged` state and swaps to a confirmation line.
5. **Primary CTA**: full-width "Scan Batch Baru (QR)" button, h-16, cyan gradient with QR icon, navigates to `registrasi`.
6. **Retained content below**: "Aksi Cepat" grid (buttons min 48px), batch table (wrap in `overflow-x-auto` for small screens), and Device/Status info folded into a compact row. Remove the old title block and 4-card stat grid (their info now lives in hero/stats).
7. Layout: `max-w-md mx-auto` on mobile, widening to a 2-column grid on `lg` (hero+stats left, alert/actions/table right) so it still works inside the existing `Layout`.

## Verification
- `npx tsc --noEmit` for type errors.
- Open preview, log in as nelayan (`nelayan@smartfrost.id` / `demo123`), check at ~390px and desktop widths: hero color/gauge matches score 92 (green), CTA navigates to Registrasi, alert button toggles, connection pill cycles states, table scrolls without overflow.
