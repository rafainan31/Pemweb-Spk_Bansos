import { Criteria, WargaDTO } from "./types";

export function calculateWP(wargaList: WargaDTO[], criteriaInput: Criteria[]) {
  const codes = criteriaInput.map((item) => item.code);

  // 1. Normalisasi Bobot Kriteria (Pangkat positif karena sudah dibalik jadi Benefit semua)
  const weightSum = criteriaInput.reduce((sum, c) => sum + Number(c.weight), 0) || 1;
  const normalizedWeights: Record<string, number> = {};
  criteriaInput.forEach((c) => {
    normalizedWeights[c.code] = Number(c.weight) / weightSum;
  });

  // 2. Hitung Vektor S
  let totalVectorS = 0;
  const initialResults = wargaList.map((row) => {
    let vectorS = 1;

    codes.forEach((code) => {
      const currentScore = Number(row.scores?.[code] || 1);
      vectorS *= Math.pow(currentScore, normalizedWeights[code]); // Rumus WP S_i
    });

    totalVectorS += vectorS;
    return { ...row, vectorS };
  });

  // 3. Hitung Vektor V (Preferensi Akhir)
  const results = initialResults.map((row) => {
    const preference = totalVectorS === 0 ? 0 : row.vectorS / totalVectorS;

    return {
      nik: row.nik,
      nama: row.nama,
      alamat: row.alamat,
      preference: Number(preference.toFixed(4)),
      rank: 0
    };
  });

  // 4. Perangkingan
  return results
    .sort((a, b) => b.preference - a.preference)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}