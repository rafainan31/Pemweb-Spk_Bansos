import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] text-slate-900">
      <header className="mx-auto flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8 xl:max-w-[1200px]">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] text-xl font-black text-white shadow-lg shadow-[#0b4ed2]/20">
            ❤
          </div>
          <div>
            <strong className="block text-lg font-black">Sistem Kelayakan</strong>
            <span className="text-sm text-slate-500">Bansos</span>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
          <a href="#beranda" className="rounded-full px-4 py-2 text-slate-900 shadow-sm shadow-slate-200/80 transition hover:bg-white">Beranda</a>
          <a href="#tentang" className="rounded-full px-4 py-2 transition hover:bg-white">Tentang</a>
          <a href="#fitur" className="rounded-full px-4 py-2 transition hover:bg-white">Fitur</a>
          <a href="#faq" className="rounded-full px-4 py-2 transition hover:bg-white">FAQ</a>
          <a href="#kontak" className="rounded-full px-4 py-2 transition hover:bg-white">Kontak</a>
          <Link to="/login" className="rounded-full bg-[#1d66f5] px-5 py-2 text-white shadow-lg shadow-[#1d66f5]/20 transition hover:brightness-110">Login Admin</Link>
        </nav>
      </header>

      <main className="space-y-20 px-6 pb-20 lg:px-10 xl:max-w-[1200px] xl:mx-auto">
        <section id="beranda" className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-[#eaf2ff] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#1d66f5]">
              SPK Bansos Metode TOPSIS
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] text-slate-900 sm:text-6xl">
                Sistem Kelayakan Bansos
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Sistem pendukung keputusan untuk membantu proses seleksi calon penerima bantuan sosial secara objektif, transparan, dan terstruktur menggunakan metode TOPSIS.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/cek-data" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1d66f5] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-[#1d66f5]/20 transition hover:brightness-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Cek Data
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Login Admin
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#eaf4ff] via-[#f0fcff] to-[#e9f7ff] p-8 shadow-[0_40px_100px_rgba(29,102,245,0.12)]">
            <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-[#1d66f5]/10 blur-2xl" />
            <div className="absolute left-0 top-20 h-32 w-32 rounded-full bg-[#22c55e]/10 blur-2xl" />
            <div className="relative grid gap-6 rounded-[34px] border border-white/80 bg-white/70 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#1d66f5] text-white shadow-lg shadow-[#1d66f5]/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Terpercaya</div>
                  <p className="text-lg font-black text-slate-900">Keamanan data dan hasil valid</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] bg-[#f8fbff] p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-[#f4f8ff] text-[#0b4ed2]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                      <path d="M8 7h8M8 11h8M8 15h4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Kelola Penerima</h3>
                  <p className="mt-2 text-sm text-slate-600">Pantau calon penerima secara detail dan terstruktur.</p>
                </div>
                <div className="rounded-[26px] bg-[#f8fbff] p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-[#f4f8ff] text-[#22c55e]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <ellipse cx="12" cy="6" rx="8" ry="3" />
                      <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
                      <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3V12" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Data Terstruktur</h3>
                  <p className="mt-2 text-sm text-slate-600">Semua data tersimpan rapi di MariaDB sehingga mudah dilacak.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tentang" className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Tentang Sistem</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              Sistem seleksi bantuan sosial dengan TOPSIS memberikan peringkat yang adil berdasarkan data warga dan kriteria penting.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Tujuan Sistem',
                text: 'Membantu proses penentuan kelayakan penerima bansos secara objektif dan terukur.',
                color: '#1d66f5',
              },
              {
                title: 'Metode TOPSIS',
                text: 'Menghitung jarak dari solusi ideal positif dan negatif untuk peringkat terbaik.',
                color: '#22c55e',
              },
              {
                title: 'Data Terstruktur',
                text: 'Data warga, kriteria, bobot, dan hasil disimpan rapi di database MariaDB.',
                color: '#fb7185',
              },
              {
                title: 'Akses Publik',
                text: 'Masyarakat dapat mengecek status kelayakan melalui halaman Cek Data.',
                color: '#f59e0b',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_26px_40px_rgba(15,31,61,0.08)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100" style={{ color: item.color }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    {item.title === 'Tujuan Sistem' ? (
                      <>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </>
                    ) : item.title === 'Metode TOPSIS' ? (
                      <>
                        <rect x="4" y="3" width="16" height="18" rx="2" />
                        <path d="M8 7h8M8 11h8M8 15h4" />
                      </>
                    ) : item.title === 'Data Terstruktur' ? (
                      <>
                        <ellipse cx="12" cy="6" rx="8" ry="3" />
                        <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
                        <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3V12" />
                      </>
                    ) : (
                      <>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      </>
                    )}
                  </svg>
                </div>
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">FAQ</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Apakah masyarakat bisa login?',
                text: 'Tidak. Masyarakat cukup menggunakan fitur Cek Data dengan memasukkan nama dan NIK.',
              },
              {
                title: 'Siapa yang bisa menginput data?',
                text: 'Data warga dan penilaian hanya dapat diinput oleh admin setelah login ke dashboard.',
              },
              {
                title: 'Apa hasil akhirnya?',
                text: 'Sistem menghasilkan status seperti Sangat Layak, Layak, Dipertimbangkan, atau Tidak Layak.',
              },
              {
                title: 'Apakah hasil dihitung otomatis?',
                text: 'Ya. Setelah data warga dan nilai kriteria dimasukkan, sistem akan menghitung ranking menggunakan metode TOPSIS.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_26px_40px_rgba(15,31,61,0.08)]">
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="kontak" className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Kontak</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Dinas Sosial', text: 'Sistem ini dapat digunakan sebagai simulasi website seleksi penerima bantuan sosial berbasis SPK.' },
              { title: 'Email', text: 'admin@bansos.local' },
              { title: 'Jam Operasional', text: 'Senin - Jumat, 08.00 - 16.00 WIB' },
              { title: 'Alamat', text: 'Kantor Pelayanan Bantuan Sosial' },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_26px_40px_rgba(15,31,61,0.08)]">
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/90 py-6 text-sm text-slate-500">
        <div className="mx-auto flex flex-col gap-2 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left xl:max-w-[1200px]">
          <span>© 2025 Sistem Kelayakan Bansos.</span>
          <span className="flex flex-wrap justify-center gap-3">Tentang · Kebijakan Privasi · Syarat & Ketentuan · Kontak</span>
        </div>
      </footer>
    </div>
  );
}