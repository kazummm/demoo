# Plan D Pass 1 — SMART-FROST

## Context
Plan D Pass 1 adds the shared status system, a persistent bottom navigation for the Nelayan role (mobile-first), a role-aware simplified Monitoring view, and promotes the inline AlertCard in DashboardNelayan to a standalone prescriptive component. These changes were partially started but never committed. No files under `src/components/` or `src/pages/` have any of these additions yet.

---

## 1. Create `src/components/Status.tsx`

New shared utility component/helper module. Exports:

```ts
// Re-usable helpers (used in Monitoring.tsx, DashboardNelayan, Peringatan, etc.)
export function getStatusFromSuhu(suhu: number): Status  // ≤4 AMAN, ≤5 WASPADA, else RISIKO
export function sortByExceptionFirst<T extends { status: Status }>(items: T[]): T[]  // RISIKO first, then WASPADA, then AMAN

// Component
export function StatusBadge({ status, size? }: { status: Status; size?: 'sm' | 'md' }) => JSX.Element
// renders a pill using existing badge-aman / badge-waspada / badge-risiko CSS classes from index.css
```

Note: `getStatusColor` and `getStatusBadgeClass` already exist in `src/data.ts` — do NOT duplicate them. `StatusBadge` should call `getStatusBadgeClass` from data.ts internally.

---

## 2. Add bottom navigation for Nelayan in `Layout.tsx`

Modify `src/components/Layout.tsx`:

- When `role === 'nelayan'`, render a **fixed bottom nav bar** (`fixed bottom-0 left-0 right-0 z-20`) with 4 key destinations from `nelayanNav`: `dashboard`, `monitoring`, `peringatan`, `riwayat`.
- Add `pb-20` padding to the main `<div className="p-6">` wrapper only when `role === 'nelayan'` so content is not hidden behind the bar.
- The sidebar still renders for Nelayan (it can still be used on tablet/desktop), but the bottom nav gives quick mobile access.
- Bottom nav item: icon centered above a tiny label, active item uses cyan color (#06b6d4) with a top border indicator, inactive uses #64a0c8.
- Background: `#0a1e38` with `border-top: 1px solid rgba(6,182,212,0.15)`.

Bottom nav items (id, label, existing icon component):
1. `dashboard` — Beranda — `<IconDashboard />`
2. `monitoring` — Monitor — `<IconMonitor />`
3. `peringatan` — Alert — `<IconAlert />`
4. `riwayat` — Riwayat — `<IconHistory />`

---

## 3. Simplify `Monitoring.tsx` for Nelayan role

Modify `src/pages/Monitoring.tsx`:

- Accept a `role?: Role` prop (interface addition).
- When `role === 'nelayan'`:
  - Hide the batch selector (Nelayan monitors only their own batch — lock to FR-001).
  - Remove the 4-column stats grid; replace with a single large suhu card + StatusBadge (using new `StatusBadge` from Status.tsx).
  - Keep the chart (it's the core value), but reduce its height to 180 from 220.
  - Remove the legend table at the bottom (duplicate of the status badge info already on DashboardNelayan).
  - Keep the AI anomaly banner (prescriptive: show what action to take, e.g. "Tambahkan es balok").
- For distributor/pemerintah: render exactly as-is today (full view, no changes).
- Pass `role` from `App.tsx` into `<Monitoring role={auth.role} />`.

---

## 4. Promote AlertCard to `src/components/AlertCard.tsx`

Create `src/components/AlertCard.tsx`:

- Extract the alert card JSX that currently lives inline in `DashboardNelayan.tsx` (lines ~175–198).
- Props: `alert: typeof alerts[0]`, `acknowledged: boolean`, `onAcknowledge: () => void`.
- Make the action button text prescriptive based on `alert.status`:
  - WASPADA → "Tambahkan es balok segera"
  - RISIKO → "Pindahkan ikan ke cold storage"
- The "acknowledged" confirmation line should include both time and a checkmark icon.

Update `DashboardNelayan.tsx` to import and use `<AlertCard>` instead of the inline block.

---

## 5. Wire `role` prop to Monitoring in App.tsx

In `src/App.tsx`, find the `case 'monitoring'` branch in `<PageContent>` and change:
```tsx
// before
<Monitoring />
// after
<Monitoring role={auth?.role} />
```
The `auth` object is already in scope in `PageContent` (it receives `role` as a prop).

---

## Critical Files

| File | Action |
|------|--------|
| `src/components/Status.tsx` | **Create new** |
| `src/components/AlertCard.tsx` | **Create new** |
| `src/components/Layout.tsx` | Modify — add bottom nav for nelayan |
| `src/pages/Monitoring.tsx` | Modify — role-aware rendering, accept role prop |
| `src/pages/DashboardNelayan.tsx` | Modify — use AlertCard component |
| `src/App.tsx` | Modify — pass role to Monitoring |

Reuse:
- `getStatusBadgeClass`, `getStatusColor` from `src/data.ts`
- `Status`, `Role` types from `src/data.ts`
- Badge CSS classes `badge-aman`, `badge-waspada`, `badge-risiko` from `src/index.css`

---

## Verification

1. Login as `nelayan@smartfrost.id` / `demo123` — bottom nav should appear at bottom of screen with 4 tabs.
2. Tap "Monitor" in bottom nav — Monitoring page opens showing single large suhu card + chart only, no batch selector, no legend table.
3. Dashboard shows AlertCard with prescriptive button text.
4. Login as `distributor@smartfrost.id` — no bottom nav, Monitoring shows full 4-stat grid + legend table.
5. Run `npx tsc --noEmit` from project root — zero type errors.
