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

export interface WargaRow {
  id: number;
  nik: string;
  nama: string;
  alamat: string | null;
  status_kelayakan: string | null;
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
}

export interface TopsisResult {
  rank: number;

  id: number;
  code: string;

  nama: string;
  nik: string;
  alamat: string;

  preference: number;
  status: string;

  dPlus: number;
  dMinus: number;

  scores: Record<string, number>;
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