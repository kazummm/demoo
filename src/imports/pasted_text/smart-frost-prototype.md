Buat aplikasi web prototype bernama SMART-FROST.

SMART-FROST adalah sistem monitoring rantai dingin hasil perikanan antarpulau di Kabupaten Pangkep yang membantu nelayan, distributor, dan pemerintah memantau kondisi ikan selama proses pengiriman.

Tagline:
"Pantau Suhu, Jaga Mutu, Telusuri Perjalanan."

Aplikasi dibuat untuk prototype GEMASTIK, sehingga tampilannya harus sederhana, modern, mudah digunakan, dan mudah didemonstrasikan.

==================================================
1. USER / PENGGUNA
==================================================

Buat 3 jenis pengguna:

1. Nelayan
2. Distributor
3. Pemerintah

Gunakan login berdasarkan role.

==================================================
2. LOGIN
==================================================

Buat halaman login sederhana:

- Email
- Password
- Pilihan role

Tombol:
"Masuk"

Sediakan akun demo:

Nelayan
Distributor
Pemerintah

Setelah login, pengguna diarahkan ke dashboard sesuai role.

==================================================
3. DASHBOARD NELAYAN
==================================================

Dashboard menampilkan:

- Batch aktif
- Suhu saat ini
- Status perangkat
- FrostScore
- Status pengiriman
- Peringatan

Contoh:

Batch Aktif:
FR-001

Suhu:
2.8°C

FrostScore:
92

Status:
AMAN

Device:
ONLINE


==================================================
4. REGISTRASI BATCH
==================================================

Buat menu:

"Registrasi Batch"

Data yang dimasukkan:

- ID Batch
- Jenis ikan
- Berat ikan
- Asal
- Tujuan
- Nama nelayan
- Distributor
- Tanggal pengiriman
- Nomor kapal

Setelah data disimpan, sistem membuat QR Code untuk batch tersebut.

==================================================
5. AKTIVASI DEVICE
==================================================

Buat halaman:

"Smart-Frost Device"

Tampilkan:

Device ID
Status
Suhu
GPS
Baterai
Koneksi
Waktu pembaruan terakhir

Contoh:

Device:
SF-001

Status:
ONLINE

Temperature:
2.7°C

GPS:
ACTIVE

Battery:
85%

Tambahkan tombol:

"Aktifkan Device"


==================================================
6. MONITORING SUHU
==================================================

Ini adalah fitur utama aplikasi.

Buat halaman:

"Monitoring Cold Chain"

Tampilkan:

- Suhu saat ini
- Suhu minimum
- Suhu maksimum
- Suhu rata-rata
- Grafik perubahan suhu
- Lokasi GPS
- Durasi perjalanan
- Status kondisi

Gunakan batas suhu contoh:

0–4°C = AMAN
4–5°C = WASPADA
>5°C = RISIKO

Tampilkan grafik suhu berdasarkan waktu.

Contoh:

08:00 → 2.1°C
09:00 → 2.4°C
10:00 → 2.8°C
11:00 → 3.2°C
12:00 → 3.7°C


==================================================
7. PERINGATAN SUHU
==================================================

Jika suhu melewati batas, tampilkan peringatan.

Contoh:

⚠ PERINGATAN

Batch:
FR-001

Suhu:
5.8°C

Status:
RISIKO

Pesan:

"Suhu berada di atas batas aman. Periksa kondisi pendinginan."


Buat 3 status:

AMAN
WASPADA
RISIKO


==================================================
8. FROSTSCORE
==================================================

Buat fitur FrostScore dengan nilai 0–100.

FrostScore digunakan sebagai indikator sederhana kondisi rantai dingin.

Perhitungan prototype mempertimbangkan:

- kestabilan suhu
- lama perjalanan
- durasi suhu di luar batas
- jumlah peringatan

Kategori:

90–100 = Sangat Baik
75–89 = Baik
60–74 = Waspada
0–59 = Risiko

Tampilkan dalam bentuk lingkaran/gauge.

Contoh:

FrostScore
87

BAIK


Tambahkan keterangan:

"Indikator kondisi rantai dingin selama perjalanan."


==================================================
9. PENGIRIMAN
==================================================

Buat halaman:

"Pengiriman"

Tampilkan alur:

Nelayan
↓
Penyimpanan
↓
Transportasi
↓
Pelabuhan
↓
Kapal
↓
Pelabuhan Tujuan
↓
Distributor
↓
Konsumen

Setiap tahap memiliki:

- waktu
- lokasi
- suhu
- status


==================================================
10. FROSTTRACE
==================================================

Buat menu:

"FrostTrace"

FrostTrace menampilkan riwayat perjalanan setiap batch.

Contoh:

FR-001

Nelayan
✓

Penyimpanan
✓

Transportasi
✓

Pelabuhan
✓

Kapal
✓

Pelabuhan Tujuan
✓

Distributor
✓

Produk Sampai
✓


Tampilkan juga:

- waktu
- lokasi
- suhu
- status

Sediakan QR Code agar informasi batch dapat ditelusuri.


==================================================
11. DASHBOARD DISTRIBUTOR
==================================================

Distributor dapat melihat:

- Pengiriman aktif
- Batch yang akan diterima
- Suhu
- FrostScore
- Status pengiriman
- Peringatan
- Riwayat pengiriman

Tambahkan tombol:

"Konfirmasi Produk Sampai"


Setelah diklik:

Status:
PRODUK TELAH DITERIMA


==================================================
12. DASHBOARD PEMERINTAH
==================================================

Buat dashboard khusus pemerintah.

Tampilkan:

Total Pengiriman
Pengiriman Aktif
Pengiriman Selesai
Pengiriman Waspada
Pengiriman Risiko

Contoh:

Total Pengiriman:
120

Aktif:
15

Selesai:
98

Waspada:
5

Risiko:
2


==================================================
13. PETA DISTRIBUSI
==================================================

Buat peta sederhana Kabupaten Pangkep dan jalur distribusi.

Tampilkan:

- lokasi asal
- lokasi tujuan
- posisi pengiriman
- jalur perjalanan
- titik peringatan

Gunakan marker:

Hijau = Aman
Kuning = Waspada
Merah = Risiko

Untuk prototype, gunakan data simulasi.

Berikan label:

"Data Simulasi"


==================================================
14. ANALISIS PEMERINTAH
==================================================

Pemerintah dapat melihat:

- rata-rata suhu
- rata-rata FrostScore
- jumlah peringatan
- durasi perjalanan
- lokasi yang sering mengalami masalah
- riwayat pengiriman

Buat grafik sederhana:

1. Grafik suhu
2. Grafik FrostScore
3. Grafik jumlah pengiriman
4. Grafik status risiko


==================================================
15. AI SEBAGAI FITUR PENDUKUNG
==================================================

Jangan membuat AI sebagai bagian yang terlalu kompleks.

AI hanya digunakan untuk membantu:

- mendeteksi kenaikan suhu yang tidak normal
- memberikan peringatan
- membantu menentukan tingkat risiko

Contoh:

Suhu:
2.8°C → 3.1°C → 3.8°C → 5.7°C

Sistem memberikan:

"Anomali suhu terdeteksi."

Kemudian:

Status:
WASPADA

AI tidak perlu membuat prediksi yang rumit.

Fokus utama tetap:

Monitoring
+
FrostScore
+
Alert
+
Traceability


==================================================
16. SIMULASI SENSOR
==================================================

Karena aplikasi masih prototype, buat fitur:

"Simulasi Sensor"

Tombol:

▶ Mulai Simulasi

Data yang berubah:

- suhu
- GPS
- waktu
- status koneksi

Sediakan 3 kondisi:

NORMAL
WASPADA
RISIKO

Contoh NORMAL:

2.0–4.0°C

WASPADA:

4.0–5.0°C

RISIKO:

>5.0°C


==================================================
17. OFFLINE MODE
==================================================

Karena distribusi antarpulau dapat mengalami keterbatasan jaringan, buat simulasi:

ONLINE
↓
OFFLINE
↓
Data disimpan sementara
↓
ONLINE kembali
↓
Data tersinkronisasi

Tampilkan status:

ONLINE
OFFLINE
SYNCING
SYNCED


==================================================
18. MENU NELAYAN
==================================================

Dashboard
Registrasi Batch
Device
Monitoring
Pengiriman
FrostScore
Peringatan
FrostTrace
Riwayat


==================================================
19. MENU DISTRIBUTOR
==================================================

Dashboard
Pengiriman
Monitoring
FrostScore
Peringatan
FrostTrace
Konfirmasi
Riwayat


==================================================
20. MENU PEMERINTAH
==================================================

Dashboard
Peta Distribusi
Monitoring
Pengiriman
FrostScore
Peringatan
Analisis
Traceability
Laporan


==================================================
21. DESAIN
==================================================

Gunakan desain:

- modern
- sederhana
- profesional
- mudah digunakan
- tidak terlalu banyak animasi

Tema:

Maritim
Cold Chain
Smart City

Gunakan kombinasi:

Navy
Biru muda
Putih
Cyan

Gunakan:

- sidebar
- card
- grafik
- tabel
- badge status
- peta

Pastikan responsive untuk desktop dan laptop.


==================================================
22. DATA DEMO
==================================================

Gunakan data simulasi yang realistis untuk demonstrasi.

Contoh:

Batch:
FR-001

Jenis:
Ikan Kerapu

Berat:
120 kg

Asal:
Pangkep

Tujuan:
Makassar

Suhu:
2.8°C

FrostScore:
92

Status:
AMAN


Batch kedua:

FR-002

Jenis:
Ikan Tenggiri

Berat:
150 kg

Suhu:
5.7°C

FrostScore:
68

Status:
WASPADA


Berikan label:

"DATA SIMULASI PROTOTYPE"


==================================================
23. ALUR DEMO UTAMA
==================================================

Demonstrasi aplikasi harus mengikuti alur:

NELAYAN

Login
↓
Registrasi Batch
↓
Aktifkan Device
↓
Monitoring
↓
Pengiriman
↓
Suhu berubah
↓
Peringatan
↓
FrostScore
↓
FrostTrace
↓
Produk Sampai


PEMERINTAH

Login
↓
Dashboard
↓
Melihat Pengiriman
↓
Melihat Suhu
↓
Melihat Peringatan
↓
Melihat FrostScore
↓
Melihat Peta
↓
Analisis Risiko
↓
Pengambilan Keputusan


==================================================
24. HASIL YANG DIHARAPKAN
==================================================

Buat aplikasi yang benar-benar dapat diklik dan digunakan untuk demo.

Prioritaskan:

1. Monitoring suhu
2. FrostScore
3. Alert
4. GPS
5. FrostTrace
6. Dashboard pemerintah
7. Peta distribusi
8. Simulasi sensor
9. Offline synchronization
10. AI sederhana sebagai pendukung

Jangan membuat AI terlalu kompleks.

SMART-FROST harus terlihat sebagai:

"Sistem monitoring rantai dingin berbasis IoT dengan AI sebagai pendukung analisis."

Bukan sebagai aplikasi AI murni.