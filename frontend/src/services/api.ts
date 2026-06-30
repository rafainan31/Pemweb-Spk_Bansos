import {
  Criteria,
  PenilaianPayload,
  SummaryResponse,
  TopsisResponse,
  Warga,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Terjadi kesalahan pada server");
  }

  return data as T;
}

export type OptionItem = {
  label: string;
  value: number;
  score: number;
};

export type OptionsResponse = {
  pendapatanBulanan: OptionItem[];
  dayaListrik: OptionItem[];
  jenisDinding: OptionItem[];
  jenisLantai: OptionItem[];
  kepemilikanKendaraan: OptionItem[];
  komponenPkh: OptionItem[];
};

export type CheckWargaResponse = Warga & {
  ranking: {
    preference: number;
    rank: number;
    status: string;
    dPlus: number;
    dMinus: number;
  } | null;
};

export type CekDataPayload = {
  nama: string;
  nik: string;
};

export type CekDataResponse = {
  id: number;
  code: string;
  nama: string;
  nik: string;
  status: string;
  ranking: {
    preference: number;
    rank: number;
    status: string;
    dPlus: number;
    dMinus: number;
  } | null;
};

export interface MetodeResult {
  id: number;
  code: string;
  nama: string;
  ranking: number;
  nilaiSAW?: number;
  nilaiWP?: number;
  preference?: number;
}

export const api = {
  health: () => request<{ message: string }>("/health"),

  getOptions: () => request<OptionsResponse>("/options"),

  getCriteria: () => request<Criteria[]>("/criteria"),

  updateCriteria: (id: number, data: Pick<Criteria, "weight" | "type">) =>
    request<{ message: string; data: Criteria[] }>(`/criteria/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getWarga: () => request<Warga[]>("/warga"),

  checkWargaByNik: (nik: string) =>
    request<CheckWargaResponse>(`/warga/nik/${nik}`),

  cekData: (payload: CekDataPayload) =>
    request<CekDataResponse>("/cek-data", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  savePenilaian: (payload: PenilaianPayload) =>
    request<{ message: string; id: number; code: string }>("/warga", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteWarga: (id: number) =>
    request<{ message: string }>(`/warga/${id}`, {
      method: "DELETE",
    }),

  getSAW: () =>
    request<MetodeResult[]>("/saw"),

  getWP: () =>
    request<MetodeResult[]>("/wp"),

  getTopsis: () => request<TopsisResponse>("/topsis"),

  getSummary: () => request<SummaryResponse>("/summary"),
};