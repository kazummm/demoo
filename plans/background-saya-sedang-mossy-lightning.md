# Akun Pemerintah: 5-tab bottom nav, read-only, privasi

## Context
Pemerintah masih memakai sidebar lama (9 item incl. Laporan/Device/Simulasi), KPI/peta menampilkan posisi kapal + ID batch, dan halaman masih punya tombol aksi, `text-xs`, dan `#64a0c8`. Tujuannya menyeragamkan dengan Nelayan/Distributor dan menyesuaikan proposal (pengawas, data agregat, read-only). Nelayan/Distributor tidak boleh berubah. `data.ts` hanya boleh ditambah export baru, nilai lama tidak diubah.

## Langkah

1. **data.ts** (tambah saja): export `hotspots` = 5 lokasi (Selat Makassar 8/4.2, Pelabuhan Pangkajene 6/5.1, Liukang 4/3.8, Rute Darat 3/4.5, Cold Storage 2/2.1) + koordinat SVG + `avgFrostScore` simulasi + tingkat via `getStatusFromSuhu`. Export `routeRisks` (7 rute + tingkat), `trendPeriods` (7 hari/30 hari/6 bulan, data simulasi; 6 bulan memakai `frostScoreHistory`/`monthlyShipments`).
2. **session.ts**: tambah `pemerintahNav` module-level (`peek/set/reset`), pola sama `distributorNav`.
3. **Layout.tsx**: `mobileShell` ikut pemerintah; ekspor icon yang dibutuhkan; hapus `pemerintahNav` sidebar lama; padding `p-4 pb-28 md:p-6`.
4. **BottomNavPemerintah.tsx** (baru): salin pola BottomNavDistributor, tanpa FAB, aksen `#06b6d4`, tab Beranda/Peta/Analitik/Peringatan/Lainnya, `min-h-16`, indikator 3px.
5. **BackBar.tsx**: sudah punya prop `label`; dipakai "Kembali ke Lainnya".
6. **App.tsx**: shell pemerintah: tab aktif (state, init dari `pemerintahNav.peek()`, reset di `useEffect` mount), halaman `lainnya` (daftar Monitoring/FrostTrace/Riwayat Pengiriman, item min-h-12), BackBar + bottom nav untuk sub-halaman, `pushState`/`popstate` seperti distributor, tab bar horizontal `md+` (pola DashboardDistributor). Guard `device`/`simulasi`/`laporan` untuk pemerintah -> dashboard. `Laporan.tsx` tidak dihapus.
7. **DashboardPemerintah.tsx**: header DKP Pangkep + label simulasi; 4 kartu (2 kolom), Distribusi Status dengan badge + stacked bar; bar chart `monthlyShipments`; 3 "Titik Rawan Teratas" dari `hotspots` + tombol "Lihat Peta"; hapus Akses Cepat.
8. **PetaDistribusi.tsx**: hapus `ships` dan daftar batch; rute tebal + label tingkat risiko; lingkaran hotspot (radius ~ kejadian, warna+teks risiko), tap -> kartu ringkasan (lokasi, kejadian, suhu rata-rata, FrostScore rata-rata); legenda teks; daftar Titik Rawan urut kejadian desc.
9. **Analisis.tsx**: hapus pie; 5 kartu ringkasan; selector periode (`min-h-12`); Tren Suhu + Tren FrostScore berdampingan `lg`; tabel Lokasi (Lokasi/Kejadian/Suhu rata-rata/Tingkat) di `md+`, kartu di ponsel, dari `hotspots`.
10. **StatusCard.tsx `AlertCard`**: prop opsional `readOnly`; bila true sembunyikan tombol/`onAcknowledge`, tampilkan "Sudah ditangani oleh operator"/"Belum ditangani". Default tidak berubah.
11. **Peringatan / Monitoring / FrostTrace / Riwayat**: untuk pemerintah: "Mode lihat saja", `readOnly`, sembunyikan tombol aksi (Monitoring toggle detail dibiarkan bila hanya tampilan; cek), hapus "Tampilkan QR" dan nama nelayan/kapal, urut RISIKO -> WASPADA, FrostTrace memakai `FrostTraceTimeline batchId`, Riwayat kartu di ponsel + tabel `md+`, filter `min-h-12`. Ganti `text-xs` -> `text-sm`, `#64a0c8` -> `SUB_TEXT` di halaman ini. Label "Data simulasi prototipe" di tiap halaman data. Role lain tetap jalur lama.

## Verifikasi
`npx tsc --noEmit 2>&1 | grep -v "^npm"` (kosong = bersih). Dev server tidak terjangkau dari shell, jadi pengecekan visual (390px & desktop, alur Lainnya -> sub-halaman -> Kembali, tombol back browser) harus dinyatakan belum dilakukan bila tetap tidak bisa.
