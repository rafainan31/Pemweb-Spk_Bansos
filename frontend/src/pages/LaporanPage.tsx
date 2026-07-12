import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { formatNumber } from "../utils/format";

// Interface terpadu kuantitatif 3 metode
interface AlternatifLaporanResult {
  id: number;
  code: string;
  nama: string;
  nik: string;
  nilai_saw: number;
  nilai_wp: number;
  nilai_topsis: number;
  ranking: number;
}

// PERBAIKAN: Fungsi Download CSV membaca skema baru secara presisi
function downloadCSV(rows: AlternatifLaporanResult[]) {
  const header = ['No', 'Kode Alternatif', 'Nama Penerima', 'NIK', 'Skor SAW', 'Skor WP', 'Skor TOPSIS', 'Peringkat'];
  const body = rows.map((row, index) => [
    index + 1,
    row.code,
    row.nama,
    row.nik,
    row.nilai_saw !== undefined ? formatNumber(row.nilai_saw) : '-',
    row.nilai_wp !== undefined ? formatNumber(row.nilai_wp) : '-',
    row.nilai_topsis !== undefined ? formatNumber(row.nilai_topsis) : '-',
    row.ranking
  ]);
  
  const csv = [header, ...body].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Laporan_Perbandingan_Bansos_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function LaporanPage() {
  const [results, setResults] = useState<AlternatifLaporanResult[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setMessage('');
    setLoading(true);
    try {
      // PERBAIKAN: Cukup panggil endpoint terpadu /topsis yang mengemas 3 nilai sekaligus
      const topsisResponse = await api.getTopsis() as any;
      setResults(topsisResponse.results || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout title="Laporan Hasil Penilaian" subtitle="Cetak, tinjau, dan unduh rekapan komparasi nilai alternatif bansos">
      
      <div className="w-full max-w-[1200px] mx-auto space-y-8">
        
        {message && (
          <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-600 border border-rose-100">
            <span>⚠️ {message}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
            <div>
              <h3 className="text-lg font-black text-slate-800">Berkas Hasil Komparasi</h3>
              <p className="text-xs text-slate-400 mt-0.5">Lembar rekapitulasi nilai akhir alternatif berdasarkan tiga metode pendukung keputusan.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 border border-rose-100 transition hover:bg-rose-100" onClick={() => window.print()}>
                Export PDF
              </button>
              <button className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 border border-emerald-100 transition hover:bg-emerald-100" onClick={() => downloadCSV(results)}>
                Export Excel
              </button>
              <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50" onClick={() => window.print()}>
                Cetak Dokumen
              </button>
            </div>
          </div>

          <table className="w-full border-separate border-spacing-y-2.5 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-4 pb-1 text-center w-14">No</th>
                <th className="px-4 pb-1 w-24">Kode</th>
                <th className="px-4 pb-1">Nama Penerima</th>
                <th className="px-4 pb-1">NIK</th>
                <th className="px-4 pb-1 text-center bg-emerald-50/50 text-emerald-600 font-bold rounded-t-lg w-28">SAW</th>
                <th className="px-4 pb-1 text-center bg-amber-50/50 text-amber-600 font-bold rounded-t-lg w-28">WP</th>
                <th className="px-4 pb-1 text-center bg-blue-50/50 text-[#1d66f5] font-bold rounded-t-lg w-28">TOPSIS</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="rounded-2xl bg-slate-50/50 py-12 text-center text-sm font-medium text-slate-400 border border-dashed border-slate-200">
                    {loading ? 'Menyusun berkas laporan...' : 'Belum ada alternatif data untuk dilaporkan.'}
                  </td>
                </tr>
              ) : (
                results.map((row, index) => (
                  <tr key={row.id} className="group transition-all duration-150 hover:-translate-y-0.5">
                    <td className="bg-slate-50/60 group-hover:bg-slate-100/40 rounded-l-xl px-4 py-3.5 text-center border-y border-l border-slate-100">
                      <span className="font-bold text-slate-400 text-xs">{index + 1}</span>
                    </td>
                    <td className="bg-slate-50/60 group-hover:bg-slate-100/40 px-4 py-3.5 font-mono text-xs font-bold text-slate-600 border-y border-slate-100">
                      {row.code}
                    </td>
                    <td className="bg-slate-50/60 group-hover:bg-slate-100/40 px-4 py-3.5 text-sm font-bold text-slate-800 border-y border-slate-100">
                      {row.nama}
                    </td>
                    <td className="bg-slate-50/60 group-hover:bg-slate-100/40 px-4 py-3.5 font-mono text-xs text-slate-500 border-y border-slate-100">
                      {row.nik}
                    </td>
                    <td className="bg-emerald-50/20 group-hover:bg-emerald-50/40 px-4 py-3.5 text-center border-y border-slate-100">
                      <span className="font-mono text-xs font-bold text-emerald-600">
                        {row.nilai_saw !== undefined ? formatNumber(row.nilai_saw) : '-'}
                      </span>
                    </td>
                    <td className="bg-amber-50/20 group-hover:bg-amber-50/40 px-4 py-3.5 text-center border-y border-slate-100">
                      <span className="font-mono text-xs font-bold text-amber-600">
                        {row.nilai_wp !== undefined ? formatNumber(row.nilai_wp) : '-'}
                      </span>
                    </td>
                    <td className="bg-blue-50/20 group-hover:bg-blue-50/40 rounded-r-xl px-4 py-3.5 text-center border-y border-r border-slate-100">
                      <span className="font-mono text-xs font-black text-[#1d66f5]">
                        {row.nilai_topsis !== undefined ? formatNumber(row.nilai_topsis) : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* METADATA LAPORAN */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div>Penilai Dokumen : <span className="text-slate-600 font-bold">Admin Dinas</span></div>
              <div>ID Sesi Sistem : <span className="text-slate-600 font-bold font-mono">BNS-2026-07</span></div>
              <div>Status Validitas : <span className="text-emerald-500 font-bold">Tersinkronisasi MariaDB</span></div>
              <div>Waktu Cetak : <span className="text-slate-600 font-bold">{new Date().toLocaleTimeString('id-ID')} WIB</span></div>
            </div>
            <div className="text-right text-xs">
              Total data alternatif: <span className="font-bold text-slate-600">{results.length} baris</span>
            </div>
          </div>

          {/* DOKUMEN TANDA TANGAN KEPALA DINAS */}
          <div className="mt-14 hidden md:flex justify-end pr-6">
            <div className="text-center space-y-16 text-xs font-medium text-slate-700">
              <div>
                <p className="text-slate-400">Tegal, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold mt-1">Penanggung Jawab Verifikator</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline">Kepala Bidang Pelayanan Sosial</p>
                <p className="text-slate-400 text-[10px] font-mono mt-0.5">NIP. 19890412 201503 1 002</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}