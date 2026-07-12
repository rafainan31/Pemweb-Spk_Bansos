export type CriteriaType = "benefit" | "cost";

export interface Criteria {
  id: number;
  code: string;
  name: string;
  weight: number;
  type: CriteriaType;
}

export interface KriteriaRow {
  id: number;
  kode: string;
  nama: string;
  type: CriteriaType;
  created_at?: Date;
  updated_at?: Date;
}

export interface KriteriaValueRow {
  id: number;
  kriteria_id: number;
  value_label: string;
  skor: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Warga {
  id: number;
  code: string;
  nama: string;
  nik: string;
  alamat: string;
  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  nilai_saw?: number;
  nilai_wp?: number;
  nilai_topsis?: number;
}

export interface WargaRow {
  id: number;
  nik: string;
  nama: string;
  alamat: string | null;
  status_kelayakan?: string | null; 
  created_at?: Date;
  updated_at?: Date;
}

export interface WargaDTO {
  id: number;
  code: string;
  nama: string;
  nik: string;
  alamat: string;
  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
  status: string;
  statusKelayakan?: string;
  scores: Record<string, number>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface PenilaianInput {
  nama: string;
  nik: string;
  alamat?: string;
  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
  userId?: number; // PERBAIKAN: Menampung ID petugas secara opsional
}

// BINDING ALIAS: Agar PenilaianPage.tsx lu yang mencari tipe ini tidak mengalami eror compile
export type PenilaianPayload = PenilaianInput;

export interface TopsisResult {
  id: number;
  code: string;
  nama: string;
  nik: string;
  alamat: string;
  preference: number;
  dPlus: number;
  dMinus: number;
  scores: Record<string, number>;
  rank: number;
  nilai_saw?: number;
  nilai_wp?: number;
  nilai_topsis?: number;
}

export interface MatrixRow extends WargaDTO {
  values: Record<string, number>;
}

export interface DistanceRow extends MatrixRow {
  dPlus: number;
  dMinus: number;
}

export interface TopsisResponse {
  assessed: WargaDTO[];
  weightSum: number;
  normalizedWeights: Record<string, number>;
  decisionMatrix: MatrixRow[];
  divisor: Record<string, number>;
  normalized: MatrixRow[];
  weighted: MatrixRow[];
  idealPositive: Record<string, number>;
  idealNegative: Record<string, number>;
  distances: DistanceRow[];
  results: TopsisResult[];
}

export interface SummaryResponse {
  totalWarga: number;
  sudahDinilai: number;
  prioritas: {
    id: number;
    nama: string;
    code: string;
    nilai_saw: number;
    nilai_wp: number;
    nilai_topsis: number;
    ranking: number;
  }[];
}

export interface AlternatifResult {
  id: number;
  code: string;
  nama: string;
  nilai_saw: number;
  nilai_wp: number;
  nilai_topsis: number;
  ranking: number;
}