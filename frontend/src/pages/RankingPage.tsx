import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { formatNumber } from "../utils/format";

// Interface pendukung adaptif sesuai respons query backend baru
interface AlternatifKuantitatifResult {
  id: number;
  code: string;
  nama: string;
  nik: string;
  nilai_saw: number;
  nilai_wp: number;
  nilai_topsis: number;
  ranking: number;
}

export default function RankingPage() {
  const [results, setResults] = useState<AlternatifKuantitatifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadData() {
    setMessage('');
    setLoading(true);
    try {
      // PANGGIL ENDPOINT TERPADU: Cukup ambil data lewat 1 API getTopsis yang sudah mengemas 3 nilai sekaligus
      const topsisData = await api.getTopsis() as any;
      
      // Ambil array results terpadu dari backend
      setResults(topsisData.results || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menghitung ranking alternatif');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout
      title="Hasil Ranking Terpadu"
      subtitle="Analisis perbandingan peringkat kelayakan penerima bantuan sosial multi-metode kuantitatif"
      right={
        <button 
          className="flex items-center gap-2 rounded-xl bg-[#1d66f5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1d66f5]/20 transition duration-200 hover:bg-[#0b4ed2] hover:scale-[1.02]" 
          onClick={loadData}
          disabled={loading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? "animate-spin" : ""}>
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {loading ? 'Menyinkronkan...' : 'Refresh Peringkat'}
        </button>
      }
    >
      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 border border-rose-100">
          <span>⚠️ {message}</span>
        </div>
      )}
      
      <div className="w-full max-w-[1200px] mx-auto space-y-4">
        <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100/40">
          <table className="w-full border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 pb-2 text-center w-14">No</th>
                <th className="px-4 pb-2 w-24">Kode</th>
                <th className="px-4 pb-2">Nama Penerima</th>
                <th className="px-4 pb-2">NIK</th>
                <th className="px-4 pb-2 text-center bg-emerald-50/60 text-emerald-600 rounded-t-xl font-black w-28">SAW</th>
                <th className="px-4 pb-2 text-center bg-amber-50/60 text-amber-600 rounded-t-xl font-black w-28">WP</th>
                <th className="px-4 pb-2 text-center bg-blue-50/60 text-[#1d66f5] rounded-t-xl font-black w-28">TOPSIS</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="rounded-2xl bg-slate-50/50 py-12 text-center text-sm font-medium text-slate-500 border border-dashed border-slate-200">
                    {loading ? 'Sedang menyinkronkan urutan peringkat...' : 'Belum ada data ranking. Silakan lakukan kalkulasi di halaman Perhitungan Terlebih Dahulu.'}
                  </td>
                </tr>
              ) : (
                results.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="group transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <td className="bg-slate-50/70 group-hover:bg-slate-100/50 rounded-l-2xl px-4 py-4 text-center border-y border-l border-slate-100/70 transition-colors">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm border border-slate-200/40">
                        {index + 1}
                      </span>
                    </td>

                    <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-sm font-bold text-slate-600 border-y border-slate-100/70 transition-colors">
                      {row.code}
                    </td>

                    <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 text-sm font-black text-slate-800 border-y border-slate-100/70 transition-colors">
                      {row.nama}
                    </td>

                    <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-sm text-slate-400 border-y border-slate-100/70 transition-colors">
                      {row.nik}
                    </td>

                    {/* Properti Kuantitatif Terpadu Langsung Mengacu pada Hasil Map Gabungan Backend */}
                    <td className="bg-emerald-50/30 group-hover:bg-emerald-50/60 px-4 py-4 text-center border-y border-slate-100/80">
                      <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100/60 font-mono text-sm font-black text-emerald-600 shadow-sm">
                        {row.nilai_saw !== undefined ? formatNumber(row.nilai_saw) : '-'}
                      </span>
                    </td>

                    <td className="bg-amber-50/30 group-hover:bg-amber-50/60 px-4 py-4 text-center border-y border-slate-100/80">
                      <span className="inline-block px-3 py-1 rounded-lg bg-amber-100/60 font-mono text-sm font-black text-amber-600 shadow-sm">
                        {row.nilai_wp !== undefined ? formatNumber(row.nilai_wp) : '-'}
                      </span>
                    </td>

                    <td className="bg-blue-50/30 group-hover:bg-blue-50/60 rounded-r-2xl px-4 py-4 text-center border-y border-r border-slate-100/80">
                      <span className="inline-block px-3 py-1 rounded-lg bg-blue-100/60 font-mono text-sm font-black text-[#1d66f5] shadow-sm">
                        {formatNumber(row.nilai_topsis)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              Kalkulasi komparasi perangkingan otomatis multi-metode berbasis MariaDB
            </div>
            <div>
              Total data alternatif: <span className="font-bold text-slate-700">{results.length} baris</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}