import { CSSProperties, useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import { formatNumber } from "../utils/format";

// Interface ini SESUAI dengan kolom di rekomendasi_result
interface AlternatifResult {
  id: number;
  nama: string;
  code: string;
  nilai_saw: number;
  nilai_wp: number;
  nilai_topsis: number;
  ranking: number;
}

export default function Dashboard() {
  const [prioritas, setPrioritas] = useState<AlternatifResult[]>([]);
  const [totalWarga, setTotalWarga] = useState(0);
  const [sudahDinilai, setSudahDinilai] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PERBAIKAN UTAMA: Paksa return type getSummary menjadi 'any' lewat Type Casting
    (api.getSummary() as Promise<any>)
      .then((summaryData) => {
        setTotalWarga(summaryData.totalWarga || 0);
        setSudahDinilai(summaryData.sudahDinilai || 0);

        // Transformasi data agar sesuai dengan AlternatifResult
        const mappedData: AlternatifResult[] = (summaryData.prioritas || []).map((item: any) => ({
          id: Number(item.id),
          code: item.code || `A${item.id}`,
          nama: item.nama || "Tanpa Nama",
          nilai_saw: Number(item.nilai_saw) || 0,
          nilai_wp: Number(item.nilai_wp) || 0,
          nilai_topsis: Number(item.nilai_topsis) || 0,
          ranking: Number(item.ranking) || 0
        }));

        setPrioritas(mappedData);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setPrioritas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const percentNilaiTinggi = useMemo(() => {
    // Tambahkan pengecekan keamanan
    if (!prioritas || !Array.isArray(prioritas) || prioritas.length === 0) return 0;

    const diAtasAmbang = prioritas.filter(item => item && item.nilai_topsis >= 0.5).length;
    return Math.round((diAtasAmbang / prioritas.length) * 100);
  }, [prioritas]);

  return (
    <Layout title="Dashboard" subtitle="Ringkasan parameter kuantitatif multi-metode pendukung keputusan.">
      {loading && <div className="info-box">Mengambil data dari MariaDB...</div>}

      <div className="hero-metric">
        <b>{percentNilaiTinggi}%</b>
        <span>Skor Topsis &gt;= 0.5</span>
      </div>

      <p className="text-xs font-semibold text-slate-500 mt-2 text-center leading-relaxed">
        Persentase jumlah total alternatif yang menembus nilai preferensi ideal (&gt;= 0.5) dalam kalkulasi normalisasi matriks keputusan.
      </p>

      <div className="stats-grid">
        <StatCard icon="◉" label="Total Warga" value={totalWarga} note="Jiwa" />
        <StatCard icon="✓" label="Dievaluasi" value={sudahDinilai} note="Data" />
        {/* KONSENSUS: Hanya filter berdasarkan TOPSIS >= 0.5 agar sinkron dengan persentase di atas */}
        <StatCard icon="▲" label="Konsensus" value={prioritas.filter(x => x.nilai_topsis >= 0.5).length} note="Skor Tinggi" color="green" />
        {/* RENDAH: Ubah filter menjadi < 0.5 dan note menjadi "< 0.5" agar data yang bernilai 0.37 masuk ke sini */}
        <StatCard icon="!" label="Rendah" value={prioritas.filter(x => x.nilai_topsis < 0.5).length} note="< 0.5" color="red" />
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100/40">
        <h3 className="mb-4">Penerima Prioritas Utama</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th>No</th><th>Kode</th><th>Nama</th><th>SAW</th><th>WP</th><th>TOPSIS</th>
            </tr>
          </thead>
          <tbody>
            {prioritas.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center">Belum ada data. Silakan hitung di Penilaian.</td></tr>
            ) : (
              prioritas.slice(0, 5).map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.code}</td>
                  <td>{row.nama}</td>
                  <td>{formatNumber(row.nilai_saw)}</td>
                  <td>{formatNumber(row.nilai_wp)}</td>
                  <td>{formatNumber(row.nilai_topsis)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}