import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { Warga } from "../types";
import { formatNumber } from "../utils/format";

export default function WargaPage() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

async function loadData() {
    setLoading(true);
    try {
      // 1. Ambil data kriteria & list hasil kalkulasi murni dari endpoint TOPSIS yang valid
      const [dataWarga, dataTopsis] = await Promise.all([
        api.getWarga(),
        api.getTopsis()
      ]);
      
    // 2. Kawinkan data warga dengan hasil kalkulasi metodenya secara paksa di frontend
      const wargaDenganNilai = dataWarga.map((w: any) => {
        // Tambahkan (as any) di akhir baris .find() agar variabel match bebas diakses propertinya
        const match = dataTopsis?.results?.find((r: any) => r.id === w.id) as any;
        
        return {
          ...w,
          nilai_topsis: match ? Number(match.nilai_topsis || match.preference || 0) : 0,
          nilai_saw: match ? Number(match.nilai_saw || 0) : 0,
          nilai_wp: match ? Number(match.nilai_wp || 0) : 0,
        };
      });
      
      setWarga(wargaDenganNilai);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil data warga');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return warga.filter((item) =>
      item.nama.toLowerCase().includes(keyword) ||
      item.nik.toLowerCase().includes(keyword) ||
      (item.code && item.code.toLowerCase().includes(keyword))
    );
  }, [warga, search]);

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data alternatif warga ini?');
    if (!confirmDelete) return;

    try {
      await api.deleteWarga(id);
      setMessage('Data alternatif warga berhasil dihapus dari sistem.');
      loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menghapus data warga');
    }
  }

  return (
    <Layout
      title="Data Warga / Alternatif"
      subtitle="Daftar profil calon penerima bantuan sosial yang terintegrasi parameter kriteria kuantitatif"
      right={
        <a
          href="/penilaian"
          className="flex items-center gap-2 rounded-xl bg-[#1d66f5] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/10 transition duration-200 hover:bg-[#0b4ed2] hover:scale-[1.01]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Registrasi Alternatif
        </a>
      }
    >
      <div className="w-full max-w-[1200px] mx-auto space-y-6">

        {/* BILAH ALAT PENCARIAN & REFRESH */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-4 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-md">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-3 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama, NIK, atau kode alternatif..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <button
            className="w-full sm:w-auto h-[42px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
            onClick={loadData}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
            Refresh
          </button>
        </div>

        {message && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-[#1d66f5] border border-blue-100">
            <span>ℹ️ {message}</span>
          </div>
        )}

        {/* TABEL MODERN DENGAN FITUR SCROLL HORIZONTAL JIKA KOLOM KEPANJANGAN */}
        <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-100/40">

          {/* Pembungkus Geser (Scroll Wrapper) */}
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full border-separate border-spacing-y-2.5 text-left min-w-[1100px]">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  <th className="px-4 pb-1 text-center w-14">No</th>
                  <th className="px-4 pb-1 w-24">Kode</th>
                  <th className="px-4 pb-1">Nama Penerima</th>
                  <th className="px-4 pb-1">NIK</th>
                  <th className="px-4 pb-1">Alamat</th>
                  {/* HEADER GABUNGAN SKOR METODE */}
                  <th className="px-4 pb-1 text-center bg-emerald-50/60 text-emerald-600 font-bold rounded-t-lg w-24">SAW</th>
                  <th className="px-4 pb-1 text-center bg-amber-50/60 text-amber-600 font-bold rounded-t-lg w-24">WP</th>
                  <th className="px-4 pb-1 text-center bg-blue-50/60 text-[#1d66f5] font-bold rounded-t-lg w-24">TOPSIS</th>
                  <th className="px-4 pb-1 text-center w-28">Status</th>
                  <th className="px-4 pb-1 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="rounded-2xl bg-slate-50/50 py-16 text-center text-sm font-medium text-slate-400 border border-dashed border-slate-200">
                      {loading ? 'Sedang memuat data alternatif...' : 'Belum ada data warga terdaftar. Silakan daftarkan melalui form Penilaian.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item: any, index) => (
                    <tr key={item.id} className="group transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap">
                      {/* No */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 rounded-l-xl px-4 py-3.5 text-center border-y border-l border-slate-100/80 transition-colors">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-400 shadow-sm border border-slate-200/40">
                          {index + 1}
                        </span>
                      </td>

                      {/* Kode Alternatif */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 px-4 py-3.5 font-mono text-xs font-bold text-[#1d66f5] border-y border-slate-100/80 transition-colors">
                        {item.code}
                      </td>

                      {/* Nama */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 px-4 py-3.5 text-sm font-black text-slate-800 border-y border-slate-100/80 transition-colors">
                        {item.nama}
                      </td>

                      {/* NIK */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 px-4 py-3.5 font-mono text-xs text-slate-500 border-y border-slate-100/80 transition-colors">
                        {item.nik}
                      </td>

                      {/* Alamat */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 px-4 py-3.5 text-xs font-medium text-slate-500 border-y border-slate-100/80 transition-colors max-w-[180px] truncate" title={item.alamat}>
                        {item.alamat}
                      </td>

                      {/* Nilai SAW Kuantitatif */}
                      <td className="bg-emerald-50/20 group-hover:bg-emerald-50/40 px-4 py-3.5 text-center border-y border-slate-100/80">
                        <span className="font-mono text-xs font-bold text-emerald-600">
                          {item.nilai_saw ? Number(item.nilai_saw).toFixed(4).replace('.', ',') : '0,0000'}
                        </span>
                      </td>

                      {/* Nilai WP Kuantitatif */}
                      <td className="bg-amber-50/20 group-hover:bg-amber-50/40 px-4 py-3.5 text-center border-y border-slate-100/80">
                        <span className="font-mono text-xs font-bold text-amber-600">
                          {item.nilai_wp ? Number(item.nilai_wp).toFixed(4).replace('.', ',') : '0,0000'}
                        </span>
                      </td>

                      {/* Nilai TOPSIS Kuantitatif */}
                      <td className="bg-blue-50/20 group-hover:bg-blue-50/40 px-4 py-3.5 text-center border-y border-slate-100/80">
                        <span className="font-mono text-xs font-black text-[#1d66f5]">
                          {item.nilai_topsis ? Number(item.nilai_topsis).toFixed(4).replace('.', ',') : '0,0000'}
                        </span>
                      </td>

                      {/* Status Evaluasi Input */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 px-4 py-3.5 text-center border-y border-slate-100/80 transition-colors">
                        <Badge variant={item.status === 'Sudah Dinilai' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="bg-slate-50/60 group-hover:bg-blue-50/30 rounded-r-xl px-4 py-3.5 border-y border-r border-slate-100/80 transition-colors">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/penilaian?nik=${item.nik}`}
                            title="Ubah Parameter"
                            className="w-8 h-8 rounded-lg bg-white text-slate-500 hover:text-blue-600 border border-slate-200 shadow-sm grid place-items-center transition duration-150 hover:scale-105"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Hapus Data"
                            className="w-8 h-8 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-200 shadow-sm grid place-items-center transition duration-150 hover:scale-105"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
            <div>
              Total alternatif terdata: <span className="text-slate-700 font-bold">{warga.length} jiwa</span>
            </div>
            <div>
              Menampilkan <span className="text-slate-700 font-bold">{filtered.length}</span> baris data hasil filter
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}