import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api, CekDataResponse } from "../services/api";

export default function CekDataPage() {
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CekDataResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nama.trim() || !nik.trim()) {
      setMessage("Nama dan NIK wajib diisi.");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setResult(null);

      const data = await api.cekData({
        nama: nama.trim(),
        nik: nik.trim(),
      });

      setResult(data);
    } catch (error) {
      setResult(null);
      setMessage(
        error instanceof Error
          ? error.message
          : "Data tidak ditemukan atau belum diproses."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[30px] bg-white/90 px-6 py-4 shadow-[0_30px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <Link to="/" className="inline-flex items-center gap-3 text-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] text-xl font-black text-white shadow-lg shadow-[#1d66f5]/20">
              ✓
            </div>
            <div>
              <strong className="block text-lg font-black">Sistem Kelayakan</strong>
              <span className="text-sm text-slate-500">Bantuan Sosial</span>
            </div>
          </Link>

          <Link className="rounded-full bg-[#1d66f5] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-[#1d66f5]/20 transition hover:brightness-110" to="/login">
            Login Admin
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <section className="w-full max-w-3xl rounded-[32px] bg-white/95 p-8 shadow-[0_40px_100px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="mb-6 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-[#1d66f5]">
              Cek Status Penerima
            </div>

            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Cek Data Bantuan Sosial
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Masukkan nama lengkap dan NIK untuk melihat status kelayakan bantuan sosial berdasarkan hasil perhitungan TOPSIS.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <label className="block space-y-3 text-sm font-semibold text-slate-700">
                <span>Nama Lengkap</span>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#1d66f5] focus:ring-4 focus:ring-[#1d66f5]/10"
                />
              </label>

              <label className="block space-y-3 text-sm font-semibold text-slate-700">
                <span>NIK</span>
                <input
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan NIK"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-[#1d66f5] focus:ring-4 focus:ring-[#1d66f5]/10"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-[#1d66f5] px-6 py-4 text-base font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-[#1d66f5]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Mengecek..." : "Cek Data"}
              </button>
            </form>

            {message && (
              <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {message}
              </div>
            )}

            {result && (
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-white px-5 py-5 shadow-sm">
                  <div>
                    <span className="text-sm uppercase tracking-[0.18em] text-slate-500">Hasil Pengecekan</span>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{result.status}</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#1d66f5] text-white shadow-lg shadow-[#1d66f5]/20 text-2xl">
                    {result.ranking ? "✓" : "!"}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <span className="block text-sm text-slate-500">Nama</span>
                    <strong className="mt-2 block text-lg text-slate-900">{result.nama}</strong>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <span className="block text-sm text-slate-500">NIK</span>
                    <strong className="mt-2 block text-lg text-slate-900">{result.nik}</strong>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <span className="block text-sm text-slate-500">Kode Alternatif</span>
                    <strong className="mt-2 block text-lg text-slate-900">{result.code}</strong>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <span className="block text-sm text-slate-500">Status</span>
                    <strong className="mt-2 block text-lg text-slate-900">{result.status}</strong>
                  </div>

                  {result.ranking ? (
                    <>
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <span className="block text-sm text-slate-500">Ranking</span>
                        <strong className="mt-2 block text-lg text-slate-900">#{result.ranking.rank}</strong>
                      </div>
                      <div className="rounded-3xl bg-white p-5 shadow-sm">
                        <span className="block text-sm text-slate-500">Nilai Preferensi</span>
                        <strong className="mt-2 block text-lg text-slate-900">{result.ranking.preference}</strong>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-full rounded-3xl bg-white p-5 shadow-sm">
                      <span className="block text-sm text-slate-500">Hasil TOPSIS</span>
                      <strong className="mt-2 block text-lg text-slate-900">Belum dihitung oleh admin</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}