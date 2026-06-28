import { Criteria, WargaDTO } from "./types";

export function calculateSAW(wargaList: WargaDTO[], criteriaInput: Criteria[]) {
  const codes = criteriaInput.map((item) => item.code);

  // 1. Normalisasi Bobot Kriteria (Total harus = 1)
  const weightSum = criteriaInput.reduce((sum, c) => sum + Number(c.weight), 0) || 1;
  const weights: Record<string, number> = {};
  criteriaInput.forEach((c) => {
    weights[c.code] = Number(c.weight) / weightSum;
  });

  // 2. Cari nilai Maksimum (Max) untuk setiap kriteria (karena semua kriteria sudah bernilai Benefit di option.ts)
  const maxValues: Record<string, number> = {};
  codes.forEach((code) => {
    const scores = wargaList.map((w) => Number(w.scores?.[code] || 0));
    maxValues[code] = Math.max(...scores) || 1; 
  });

  // 3. Hitung Nilai Preferensi
  const results = wargaList.map((row) => {
    let totalValue = 0;

    codes.forEach((code) => {
      const currentScore = Number(row.scores?.[code] || 0);
      const r = currentScore / maxValues[code]; // Rumus Benefit SAW
      totalValue += r * weights[code];
    });

    return {
      nik: row.nik,
      nama: row.nama,
      alamat: row.alamat,
      preference: Number(totalValue.toFixed(4)),
      rank: 0
    };
  });

  // 4. Perangkingan
  return results
    .sort((a, b) => b.preference - a.preference)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}