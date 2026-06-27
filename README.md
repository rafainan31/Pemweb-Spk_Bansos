# Sistem Kelayakan Bansos TOPSIS

Project ini berisi website SPK kelayakan bansos dengan:

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- Database: MariaDB
- Metode SPK: TOPSIS

## Kriteria Final

| Kode | Nama Kriteria | Bobot | Tipe |
|---|---|---:|---|
| C1 | Pendapatan Bulanan | 5 | Cost |
| C2 | Daya Listrik | 4 | Cost |
| C3 | Jenis Dinding | 3 | Benefit |
| C4 | Jenis Lantai | 3 | Benefit |
| C5 | Kepemilikan Kendaraan | 4 | Cost |
| C6 | Komponen PKH | 5 | Benefit |

Catatan:

- Cost: semakin besar skor, semakin tidak layak.
- Benefit: semakin besar skor, semakin layak.
- Backend menormalisasi bobot otomatis menjadi total 1 sebelum menghitung TOPSIS.

## Setup Database

### Kalau database masih kosong / baru

```bash
mysql -u root -p < database/schema.sql
```

### Kalau database lama sudah pernah dibuat

Jalankan migration ini agar tabel lama menyesuaikan kriteria baru:

```bash
mysql -u root -p < database/migration-kriteria-baru.sql
```

Kalau MariaDB kamu belum mendukung `ADD COLUMN IF NOT EXISTS`, jalankan SQL di file migration secara bertahap dan hapus bagian `IF NOT EXISTS`.

## Jalankan Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Cek backend:

```text
http://localhost:5000/api/health
```

## Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka website:

```text
http://localhost:5173
```

## Login

Login admin masih frontend sederhana. Isi username dan password apa saja, lalu klik Login.
