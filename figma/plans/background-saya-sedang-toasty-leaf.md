# Rencana: Dashboard Nelayan mobile-first (FrostScore hero + Scan QR)

## Context
Brief tidak memuat instruksi eksplisit, hanya snippet layar "Kapal Nelayan 01" (header, FrostScore hero, stat Suhu/Durasi, tombol Scan QR). Pertanyaan klarifikasi tidak dapat dijawab, jadi asumsi saya: snippet adalah referensi layout untuk `src/pages/DashboardNelayan.tsx`, diterapkan di tempat (bukan app baru), dengan tema navy/cyan yang sudah ada, bukan palet abu/putih bawaan snippet. Jika asumsi salah, koreksi sebelum eksekusi.

## Perubahan (hanya `src/pages/DashboardNelayan.tsx`)
1. Header: nama kapal dari `batch.kapal` (bukan hardcode), ikon sinyal SVG (bukan emoji) dengan status device online.
2. Hero FrostScore: kartu besar rounded-3xl, angka `batch.frostScore` ukuran 6xl, label dari `getFrostScoreCategory` (warna dan teks dinamis, border atas berwarna sesuai kategori). Latar `#0d2040`, teks `#e8f4fd`/`#64a0c8` agar konsisten dengan halaman lain.
3. Quick stats 2 kolom: Suhu (`batch.suhu`) dan Durasi. Cek `src/data.ts` apakah batch punya field durasi/waktu berangkat; jika tidak, tambah field mock `durasi` di data.
4. Tombol utama "Scan Batch Baru (QR)" lebar penuh, gradasi cyan, memanggil `onNavigate('registrasi')`.
5. Pertahankan blok yang sudah ada di bawahnya (banner batch aktif, peringatan terakhir, aksi cepat, tabel batch) agar fitur tidak hilang; tabel dibungkus `overflow-x-auto` agar aman di layar sempit.
6. Layout konten dibatasi `max-w-md mx-auto` untuk tampilan ponsel, tetap responsif di desktop lewat `lg:` grid.

## File kritis
- `src/pages/DashboardNelayan.tsx` (ubah)
- `src/data.ts` (hanya jika field durasi belum ada; reuse `batches`, `getFrostScoreCategory`, `getStatusBadgeClass`)
- `src/App.tsx`, `src/components/Layout.tsx`: tidak diubah

## Verifikasi
Login sebagai Nelayan di preview, cek dashboard pada lebar ~390px dan desktop, pastikan tombol Scan membuka halaman Registrasi Batch, dan jalankan `npx tsc --noEmit` untuk memastikan bebas error TypeScript.
