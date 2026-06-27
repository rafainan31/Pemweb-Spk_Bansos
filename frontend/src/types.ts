export type CriteriaType = "benefit" | "cost";

export interface Criteria {
  id: number;
  code: string;
  name: string;
  weight: number;
  type: CriteriaType;
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
  statusKelayakan?: string;

  scores: Record<string, number>;

  createdAt?: string;
  updatedAt?: string;
}

export interface PenilaianPayload {
  nama: string;
  nik: string;
  alamat: string;

  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
}

export interface RankingResult {
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

export interface MatrixRow extends Warga {
  values: Record<string, number>;
}

export interface DistanceRow extends MatrixRow {
  dPlus: number;
  dMinus: number;
}

export interface TopsisResponse {
  criteria: Criteria[];

  assessed: Warga[];

  weightSum: number;
  normalizedWeights: Record<string, number>;

  decisionMatrix: MatrixRow[];
  divisor: Record<string, number>;

  normalized: MatrixRow[];
  weighted: MatrixRow[];

  idealPositive: Record<string, number>;
  idealNegative: Record<string, number>;

  distances: DistanceRow[];
  results: RankingResult[];
}

export interface SummaryResponse {
  totalWarga: number;
  sudahDinilai: number;

  sangatLayak: number;
  layak: number;
  dipertimbangkan: number;
  tidakLayak: number;

  prioritas: RankingResult[];
}