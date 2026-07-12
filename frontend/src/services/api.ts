import axios from "axios";
import { Criteria } from "../types";

// Base URL ke server backend MariaDB lu
const API_BASE_URL = "http://localhost:5000/api";

// Config standar Axios
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface pendukung payload & data response kriteria
export interface OptionItem {
  label: string;
  value: number;
  score?: number;
}

export interface OptionsResponse {
  pendapatanBulanan: OptionItem[];
  dayaListrik: OptionItem[];
  jenisDinding: OptionItem[];
  jenisLantai: OptionItem[];
  kepemilikanKendaraan: OptionItem[];
  komponenPkh: OptionItem[];
}

export interface WargaResponse {
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
  scores: Record<string, number>;
  nilai_topsis: number;
  nilai_saw: number;
  nilai_wp: number;
}

// Object service API utama yang diekspor ke halaman pages frontend
export const api = {
  // 1. Fungsi Simpan Penilaian & Identitas Warga (Menangkap userId Petugas Lapangan)
  async savePenilaian(payload: any) {
    const response = await instance.post("/warga", payload);
    return response.data; // Mengembalikan { message, id, code }
  },

  // 2. Ambil List Seluruh Data Warga Kelayakan Bansos
  async getWarga(): Promise<WargaResponse[]> {
    const response = await instance.get("/warga");
    return response.data;
  },

  // 3. Hapus Data Warga Berdasarkan ID
  async deleteWarga(id: number) {
    const response = await instance.delete(`/warga/${id}`);
    return response.data;
  },

  // 4. Ambil Semua Opsi Nilai Parameter Kriteria (C1-C6) Langsung dari Database
  async getOptions(): Promise<OptionsResponse> {
    const response = await instance.get("/options");
    return response.data;
  },

  // 5. Ambil Semua Data Kriteria Beserta Jenis Aturan & Bobot Nilai Kepentingan
  async getCriteria(): Promise<Criteria[]> {
    const response = await instance.get("/criteria");
    return response.data;
  },

  // 6. Update Bobot atau Jenis Kriteria Tertentu
  async updateCriterion(id: number, weight: number, type: string) {
    const response = await instance.put(`/criteria/${id}`, { weight, type });
    return response.data;
  },

  // 7. Ambil Detail Hasil Perhitungan Matriks TOPSIS Terupdate (Disesuaikan untuk WargaPage)
  async getTopsis(): Promise<{
    criteria: Criteria[];
    results: any[];
    normalizedWeights: Record<string, number>;
    idealPositive: Record<string, number>;
    idealNegative: Record<string, number>;
    weightSum: number;
  }> {
    const response = await instance.get("/topsis");
    return response.data;
  },

  // 8. Ambil Summary Data Statistik untuk Dashboard Utama
  async getSummary(): Promise<{
    totalWarga: number;
    sudahDinilai: number;
    prioritas: any[];
  }> {
    const response = await instance.get("/summary");
    return response.data;
  },

  // 9. Paksa Pemicu Hitung Ulang Sinkronisasi Komparasi Multi-Metode
  async calculateMatrix() {
    const response = await instance.get("/calculate");
    return response.data;
  }
};