import { Criteria, WargaDTO } from "./types";

export function calculateSAW(wargaList: WargaDTO[], criteria: Criteria[]) {
  const data = wargaList.filter(item => item.scores && Object.keys(item.scores).length > 0);

  if (data.length === 0) {
    return [];
  }

  const totalBobot = criteria.reduce((sum, c) => sum + Number(c.weight), 0);

  const result = data.map(warga => {
    let nilaiAkhir = 0;

    criteria.forEach(c => {
      const nilai = Number(warga.scores[c.code] || 0);
      const semuaNilai = data.map(item => Number(item.scores[c.code] || 0));
      
      let normalisasi = 0;

      if (c.type === "benefit") {
        const maxVal = Math.max(...semuaNilai);
        normalisasi = maxVal === 0 ? 0 : nilai / maxVal;
      } else {
        const minVal = Math.min(...semuaNilai);
        normalisasi = nilai === 0 ? 0 : minVal / nilai;
      }

      const bobot = Number(c.weight) / totalBobot;
      nilaiAkhir += normalisasi * bobot;
    });

    return {
      id: warga.id,
      code: warga.code,
      nama: warga.nama,
      nilaiSAW: Number(nilaiAkhir.toFixed(4))
    };
  });

  return result
    .sort((a, b) => b.nilaiSAW - a.nilaiSAW)
    .map((item, index) => ({ ...item, ranking: index + 1 }));
}