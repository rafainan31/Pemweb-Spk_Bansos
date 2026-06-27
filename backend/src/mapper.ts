import { WargaDTO, WargaRow } from "./types";

export function mapWarga(row: WargaRow): WargaDTO {
  return {
    id: row.id,
    code: `A${row.id}`,

    nama: row.nama,
    nik: row.nik,
    alamat: row.alamat || "-",

    pendapatanBulanan: "",
    dayaListrik: "",
    jenisDinding: "",
    jenisLantai: "",
    kepemilikanKendaraan: "",
    komponenPkh: "",

    status: row.status_kelayakan ? "Sudah Dinilai" : "Belum Dinilai",
    statusKelayakan: row.status_kelayakan || "Belum Dinilai",

    scores: {},

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}