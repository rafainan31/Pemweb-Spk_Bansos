export type OptionKey =
  | 'pendapatanBulanan'
  | 'dayaListrik'
  | 'jenisDinding'
  | 'jenisLantai'
  | 'kepemilikanKendaraan'
  | 'komponenPkh';

export interface FormOption {
  label: string;
  value: number;
  hint?: string;
}

export const options: Record<OptionKey, FormOption[]> = {
  pendapatanBulanan: [
    { label: '≤ Rp500.000', value: 1, hint: 'Sangat rendah' },
    { label: 'Rp500.001 - Rp1.000.000', value: 2, hint: 'Rendah' },
    { label: 'Rp1.000.001 - Rp1.500.000', value: 3, hint: 'Sedang' },
    { label: 'Rp1.500.001 - Rp2.500.000', value: 4, hint: 'Cukup tinggi' },
    { label: '> Rp2.500.000', value: 5, hint: 'Tinggi' }
  ],
  dayaListrik: [
    { label: '450 VA', value: 1 },
    { label: '900 VA', value: 2 },
    { label: '1300 VA', value: 3 },
    { label: '2200 VA', value: 4 },
    { label: '> 2200 VA', value: 5 }
  ],
  jenisDinding: [
    { label: 'Tembok permanen bagus', value: 1 },
    { label: 'Tembok belum diplester', value: 2 },
    { label: 'Papan', value: 3 },
    { label: 'Kayu', value: 4 },
    { label: 'Bambu / bilik / tidak layak', value: 5 }
  ],
  jenisLantai: [
    { label: 'Keramik bagus', value: 1 },
    { label: 'Keramik rusak', value: 2 },
    { label: 'Semen', value: 3 },
    { label: 'Papan', value: 4 },
    { label: 'Tanah', value: 5 }
  ],
  kepemilikanKendaraan: [
    { label: 'Tidak punya kendaraan', value: 1 },
    { label: 'Sepeda', value: 2 },
    { label: 'Sepeda motor lama', value: 3 },
    { label: 'Sepeda motor bagus / lebih dari satu', value: 4 },
    { label: 'Mobil', value: 5 }
  ],
  komponenPkh: [
    { label: 'Tidak ada komponen PKH', value: 1 },
    { label: 'Anak sekolah', value: 2 },
    { label: 'Balita / ibu hamil', value: 3 },
    { label: 'Lansia', value: 4 },
    { label: 'Disabilitas berat / banyak komponen', value: 5 }
  ]
};

export const criteriaMeta: Record<OptionKey, { code: string; name: string; type: 'benefit' | 'cost'; description: string }> = {
  pendapatanBulanan: {
    code: 'C1',
    name: 'Pendapatan Bulanan',
    type: 'cost',
    description: 'Semakin tinggi pendapatan, semakin kecil prioritas bantuan.'
  },
  dayaListrik: {
    code: 'C2',
    name: 'Daya Listrik',
    type: 'cost',
    description: 'Semakin besar daya listrik, semakin kecil prioritas bantuan.'
  },
  jenisDinding: {
    code: 'C3',
    name: 'Jenis Dinding',
    type: 'benefit',
    description: 'Semakin tidak layak kondisi dinding, semakin tinggi prioritas.'
  },
  jenisLantai: {
    code: 'C4',
    name: 'Jenis Lantai',
    type: 'benefit',
    description: 'Semakin tidak layak kondisi lantai, semakin tinggi prioritas.'
  },
  kepemilikanKendaraan: {
    code: 'C5',
    name: 'Kepemilikan Kendaraan',
    type: 'cost',
    description: 'Semakin mahal kendaraan, semakin kecil prioritas bantuan.'
  },
  komponenPkh: {
    code: 'C6',
    name: 'Komponen PKH',
    type: 'benefit',
    description: 'Semakin banyak/berat komponen PKH, semakin tinggi prioritas.'
  }
};
