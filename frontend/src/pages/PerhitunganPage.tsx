import { useEffect, useState } from "react";
import Badge from "../components/Badge.js";
import Layout from "../components/Layout.js";
import { api } from "../services/api.js";
import { Criteria, TopsisResponse } from "../types.js";
import { formatNumber } from "../utils/format.js";

interface AlternatifKuantitatifResult {
  id: number;
  code: string;
  nama: string;
  nik: string;
  dPlus: number;
  dMinus: number;
  nilai_saw: number;
  nilai_wp: number;
  nilai_topsis: number;
  ranking: number;
}

// Extends tipe response bawaan agar adaptif dengan kolom baru dari backend
interface ExtendedTopsisResponse extends Omit<TopsisResponse, 'results'> {
  results: AlternatifKuantitatifResult[];
}

export default function PerhitunganPage() {
  const [data, setData] = useState<ExtendedTopsisResponse | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setMessage('');
    setLoading(true);
    try {
      // Ambil data terpadu 3 metode langsung lewat endpoint tunggal backend
      const topsisResponse = await api.getTopsis() as unknown as ExtendedTopsisResponse;
      setData(topsisResponse);
    } catch (error) {
      setData(null);
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil data matriks perhitungan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const criteria: Criteria[] = data?.criteria || [];
  const results: AlternatifKuantitatifResult[] = data?.results || [];

  return (
    <Layout
      title="Perhitungan & Perbandingan Metode"
      subtitle="Analisis kalkulasi matriks parameter kriteria serta komparasi nilai multi-algoritma"
      right={
        <button
          className="flex items-center gap-2 rounded-xl bg-[#1d66f5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1d66f5]/20 transition duration-200 hover:bg-[#0b4ed2] hover:scale-[1.02]"
          onClick={loadData}
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? "animate-spin" : ""}>
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {loading ? 'Memproses Matriks...' : 'Hitung Ulang Matriks'}
        </button>
      }
    >
      <div className="w-full max-w-[1200px] mx-auto space-y-10 px-1 py-2">

        {message && (
          <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-600 border border-rose-100">
            <span>⚠️ {message}</span>
          </div>
        )}

        {/* TAMPILAN STEPS ALGORITMA */}
        <div className="steps premium-steps">
          <div className="step done">1<span>Matriks Keputusan</span></div>
          <div className="step done">2<span>Normalisasi</span></div>
          <div className="step done">3<span>Bobot Normal</span></div>
          <div className="step done">4<span>Solusi Ideal</span></div>
          <div className="step active">5<span>Jarak Separasi</span></div>
          <div className="step active">6<span>Komparasi Nilai</span></div>
        </div>

        {!data || results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center text-sm font-medium text-slate-400">
            {loading ? 'Sedang mengekstraksi dan menyinkronkan seluruh baris matriks...' : 'Belum ada data penilaian untuk dihitung.'}
          </div>
        ) : (
          <>
            {/* SEKSI 1: KRITERIA & BOBOT */}
            <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Kriteria & Pembobotan Normal</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Konfigurasi parameter nilai internal database MariaDB.</p>
                </div>
                <Badge variant="success">Total Bobot Kriteria: {data.weightSum}</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2 text-left min-w-[600px]">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 pb-1 text-center w-14">No</th>
                      <th className="px-4 pb-1 w-24">Kode</th>
                      <th className="px-4 pb-1">Nama Parameter</th>
                      <th className="px-4 pb-1">Bobot Nilai</th>
                      <th className="px-4 pb-1">Bobot Ternormalisasi</th>
                      <th className="px-4 pb-1">Tipe Kriteria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((item, index) => (
                      <tr key={item.id} className="bg-slate-50/50">
                        <td className="px-4 py-3 rounded-l-xl text-center font-bold text-slate-400 text-xs">{index + 1}</td>
                        <td className="px-4 py-3"><span className="inline-block px-2.5 py-1 rounded-md bg-slate-200/60 font-mono text-xs font-bold text-slate-700">{item.code}</span></td>
                        <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.weight}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{formatNumber(data.normalizedWeights[item.code])}</td>
                        <td className="px-4 py-3 rounded-r-xl"><Badge variant={item.type === 'benefit' ? 'success' : 'warning'}>{item.type.toUpperCase()}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEKSI 2: GRID SOLUSI IDEAL & SEPARASI */}
            <div className="grid gap-6 md:grid-cols-3 w-full">
              <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-lg shadow-slate-100/60 overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Solusi Ideal Positif (A+)
                </h3>
                <table className="w-full text-xs text-left">
                  <tbody>
                    {criteria.map((item) => (
                      <tr key={item.code} className="border-b border-slate-50 last:border-0">
                        <td className="py-2.5 text-slate-500 font-medium truncate max-w-[150px]">{item.code} - {item.name}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-800">{formatNumber(data.idealPositive[item.code])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-lg shadow-slate-100/60 overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Solusi Ideal Negatif (A-)
                </h3>
                <table className="w-full text-xs text-left">
                  <tbody>
                    {criteria.map((item) => (
                      <tr key={item.code} className="border-b border-slate-50 last:border-0">
                        <td className="py-2.5 text-slate-500 font-medium truncate max-w-[150px]">{item.code} - {item.name}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-800">{formatNumber(data.idealNegative[item.code])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TABEL SEPARASI: Tetap dikunci murni 3 kolom agar layout lurus */}
              <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-lg shadow-slate-100/60 overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Jarak Jangkau Separasi
                </h3>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 font-bold">
                      <th className="pb-2">Alternatif</th>
                      <th className="pb-2 text-right">D+</th>
                      <th className="pb-2 text-right">D-</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 8).map((item) => (
                      <tr key={item.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-2 text-slate-700 font-bold">{item.code}</td>
                        <td className="py-2 text-right font-mono text-slate-500">{formatNumber(item.dPlus)}</td>
                        <td className="py-2 text-right font-mono text-slate-500">{formatNumber(item.dMinus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEKSI 3: TABEL KOMPARASI MULTI-METODE (DENGAN KOLOM NIK YANG SUDAH LUURUS) */}
            <div className="overflow-hidden rounded-[28px] border border-slate-200/60 bg-white p-6 shadow-2xl shadow-slate-100/80">
              <div className="border-b border-slate-100 pb-5 mb-4">
                <h3 className="text-xl font-black text-slate-800">Komparasi Nilai Akhir Multi-Metode</h3>
                <p className="text-xs text-slate-400 mt-1">Matriks komparasi nilai alternatif yang diurutkan dinamis berdasarkan performa kalkulasi.</p>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3 text-left min-w-[800px]">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 pb-1 text-center w-14">No</th>
                      <th className="px-4 pb-1 w-24">Kode</th>
                      <th className="px-4 pb-1">Nama Alternatif</th>
                      <th className="px-4 pb-1">NIK</th>
                      <th className="px-4 pb-1 text-slate-400/80">D+</th>
                      <th className="px-4 pb-1 text-slate-400/80">D-</th>
                      <th className="px-4 pb-1 text-center bg-emerald-50/60 text-emerald-600 rounded-t-xl font-black w-28">SAW</th>
                      <th className="px-4 pb-1 text-center bg-amber-50/60 text-amber-600 rounded-t-xl font-black w-28">WP</th>
                      <th className="px-4 pb-1 text-center bg-blue-50/60 text-[#1d66f5] rounded-t-xl font-black w-28">TOPSIS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, index) => (
                      <tr key={item.id} className="group transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap">
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 rounded-l-2xl px-4 py-4 text-center border-y border-l border-slate-100">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm border border-slate-200/40">
                            {index + 1}
                          </span>
                        </td>
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-sm font-bold text-slate-600 border-y border-slate-100">
                          {item.code}
                        </td>
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 text-sm font-black text-slate-800 border-y border-slate-100">
                          {item.nama}
                        </td>
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-sm text-slate-400 border-y border-slate-100">
                          {item.nik || '-'}
                        </td>
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-xs text-slate-400 border-y border-slate-100">
                          {formatNumber(item.dPlus)}
                        </td>
                        <td className="bg-slate-50/70 group-hover:bg-slate-100/50 px-4 py-4 font-mono text-xs text-slate-400 border-y border-slate-100">
                          {formatNumber(item.dMinus)}
                        </td>
                        <td className="bg-emerald-50/30 group-hover:bg-emerald-50/70 px-4 py-4 text-center border-y border-slate-100/80">
                          <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100/60 font-mono text-sm font-black text-emerald-600 shadow-sm">
                            {item.nilai_saw !== undefined ? formatNumber(item.nilai_saw) : '-'}
                          </span>
                        </td>
                        <td className="bg-amber-50/30 group-hover:bg-amber-50/70 px-4 py-4 text-center border-y border-slate-100/80">
                          <span className="inline-block px-3 py-1 rounded-lg bg-amber-100/60 font-mono text-sm font-black text-amber-600 shadow-sm">
                            {item.nilai_wp !== undefined ? formatNumber(item.nilai_wp) : '-'}
                          </span>
                        </td>
                        <td className="bg-blue-50/30 group-hover:bg-blue-50/70 rounded-r-2xl px-4 py-4 text-center border-y border-r border-slate-100/80">
                          <span className="inline-block px-3 py-1 rounded-lg bg-blue-100/60 font-mono text-sm font-black text-[#1d66f5] shadow-sm">
                            {formatNumber(item.nilai_topsis)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Matriks komparasi nilai kuantitatif terintegrasi langsung basis data MariaDB
                </div>
                <div>
                  Total alternatif aktif: <span className="text-slate-700 font-bold">{results.length} baris</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}