USE bansos_topsis;

-- Jalankan file ini kalau database lama kamu masih memakai kriteria lama.
-- File ini menjaga data lama tetap ada, lalu menambahkan kolom baru C1-C6.

ALTER TABLE warga
  MODIFY status_hubungan_keluarga VARCHAR(150) NULL,
  MODIFY status_perkawinan VARCHAR(150) NULL,
  MODIFY pendidikan VARCHAR(150) NULL,
  MODIFY pekerjaan VARCHAR(150) NULL,
  MODIFY kepemilikan_usaha VARCHAR(150) NULL,
  MODIFY disabilitas VARCHAR(150) NULL,
  MODIFY penyakit_kronis VARCHAR(150) NULL;

ALTER TABLE warga
  ADD COLUMN IF NOT EXISTS pendapatan_bulanan VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS daya_listrik VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS jenis_dinding VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS jenis_lantai VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS kepemilikan_kendaraan VARCHAR(150) NULL,
  ADD COLUMN IF NOT EXISTS komponen_pkh VARCHAR(150) NULL;

ALTER TABLE warga
  ADD COLUMN IF NOT EXISTS c1 TINYINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS c2 TINYINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS c3 TINYINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS c4 TINYINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS c5 TINYINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS c6 TINYINT NOT NULL DEFAULT 1;

DELETE FROM criteria;

INSERT INTO criteria (code, key_name, name, weight, type) VALUES
('C1', 'pendapatanBulanan', 'Pendapatan Bulanan', 5, 'cost'),
('C2', 'dayaListrik', 'Daya Listrik', 4, 'cost'),
('C3', 'jenisDinding', 'Jenis Dinding', 3, 'benefit'),
('C4', 'jenisLantai', 'Jenis Lantai', 3, 'benefit'),
('C5', 'kepemilikanKendaraan', 'Kepemilikan Kendaraan', 4, 'cost'),
('C6', 'komponenPkh', 'Komponen PKH', 5, 'benefit');
