export const scoringOptions: Record<string, { label: string; score: number }[]> = {
  pendapatanBulanan: [
    { label: '≤ Rp500.000', score: 1 },
    { label: 'Rp500.001 - Rp1.000.000', score: 2 },
    { label: 'Rp1.000.001 - Rp1.500.000', score: 3 },
    { label: 'Rp1.500.001 - Rp2.500.000', score: 4 },
    { label: '> Rp2.500.000', score: 5 }
  ],
  dayaListrik: [
    { label: '450 VA', score: 1 },
    { label: '900 VA', score: 2 },
    { label: '1300 VA', score: 3 },
    { label: '2200 VA', score: 4 },
    { label: '> 2200 VA', score: 5 }
  ],
  jenisDinding: [
    { label: 'Tembok permanen bagus', score: 1 },
    { label: 'Tembok belum diplester', score: 2 },
    { label: 'Papan', score: 3 },
    { label: 'Kayu', score: 4 },
    { label: 'Bambu / bilik / tidak layak', score: 5 }
  ],
  jenisLantai: [
    { label: 'Keramik bagus', score: 1 },
    { label: 'Keramik rusak', score: 2 },
    { label: 'Semen', score: 3 },
    { label: 'Papan', score: 4 },
    { label: 'Tanah', score: 5 }
  ],
  kepemilikanKendaraan: [
  {label: 'Mobil', score: 1},
  {label: 'Sepeda motor bagus / lebih dari satu', score: 2},
  {label: 'Sepeda motor lama', score: 3},
  {label: 'Sepeda', score: 4},
  {label: 'Tidak punya kendaraan', score: 5}
],
  komponenPkh: [
    { label: 'Tidak ada komponen PKH', score: 1 },
    { label: 'Anak sekolah', score: 2 },
    { label: 'Balita / ibu hamil', score: 3 },
    { label: 'Lansia', score: 4 },
    { label: 'Disabilitas berat / banyak komponen', score: 5 }
  ]
};

export type ScoringOptionKey = keyof typeof scoringOptions;

export function getScore(optionKey: string, selectedLabel: string): number {
  const found = scoringOptions[optionKey]?.find((item) => item.label === selectedLabel);
  return found?.score ?? 1;
}
