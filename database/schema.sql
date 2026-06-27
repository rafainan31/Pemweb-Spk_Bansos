CREATE DATABASE IF NOT EXISTS bansos_topsis
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bansos_topsis;

CREATE TABLE IF NOT EXISTS criteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  key_name VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  weight DECIMAL(8,4) NOT NULL,
  type ENUM('benefit', 'cost') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) UNIQUE,
  nama VARCHAR(150) NOT NULL,
  nik VARCHAR(30) NOT NULL UNIQUE,
  alamat TEXT,
  pendapatan_bulanan VARCHAR(150) NOT NULL,
  daya_listrik VARCHAR(150) NOT NULL,
  jenis_dinding VARCHAR(150) NOT NULL,
  jenis_lantai VARCHAR(150) NOT NULL,
  kepemilikan_kendaraan VARCHAR(150) NOT NULL,
  komponen_pkh VARCHAR(150) NOT NULL,
  c1 TINYINT NOT NULL DEFAULT 1,
  c2 TINYINT NOT NULL DEFAULT 1,
  c3 TINYINT NOT NULL DEFAULT 1,
  c4 TINYINT NOT NULL DEFAULT 1,
  c5 TINYINT NOT NULL DEFAULT 1,
  c6 TINYINT NOT NULL DEFAULT 1,
  status_penilaian ENUM('Belum Dinilai', 'Sudah Dinilai') NOT NULL DEFAULT 'Sudah Dinilai',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELETE FROM criteria;

INSERT INTO criteria (code, key_name, name, weight, type) VALUES
('C1', 'pendapatanBulanan', 'Pendapatan Bulanan', 5, 'cost'),
('C2', 'dayaListrik', 'Daya Listrik', 4, 'cost'),
('C3', 'jenisDinding', 'Jenis Dinding', 3, 'benefit'),
('C4', 'jenisLantai', 'Jenis Lantai', 3, 'benefit'),
('C5', 'kepemilikanKendaraan', 'Kepemilikan Kendaraan', 4, 'cost'),
('C6', 'komponenPkh', 'Komponen PKH', 5, 'benefit');
