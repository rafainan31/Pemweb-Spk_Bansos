import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f8ff] via-[#f8faff] to-white text-slate-900 scroll-smooth">
      {/* HEADER */}
      <header className="mx-auto flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8 xl:max-w-[1200px]">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-900 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] text-xl font-black text-white shadow-lg shadow-[#0b4ed2]/20 transition-transform group-hover:scale-105">
            ❤
          </div>
          <div>
            <strong className="block text-lg font-black tracking-tight">Sistem Kelayakan</strong>
            <span className="text-sm font-medium text-slate-500">Bansos</span>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 p-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-md">
          <a href="#beranda" className="rounded-full px-4 py-2 text-slate-900 transition hover:bg-slate-100/80">Beranda</a>
          <a href="#tentang" className="rounded-full px-4 py-2 transition hover:bg-slate-100/80">Tentang</a>
          <a href="#faq" className="rounded-full px-4 py-2 transition hover:bg-slate-100/80">FAQ</a>
          <a href="#kontak" className="rounded-full px-4 py-2 transition hover:bg-slate-100/80">Kontak</a>
          <Link to="/login" className="ml-2 rounded-full bg-[#1d66f5] px-5 py-2 text-white shadow-md shadow-[#1d66f5]/10 transition hover:bg-[#0b4ed2] hover:shadow-lg hover:shadow-[#0b4ed2]/20">
            Login Admin
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="space-y-32 px-6 pb-24 lg:px-10 xl:mx-auto xl:max-w-[1200px]">
        
        {/* SECTION 1: BERANDA (HERO) */}
        <section id="beranda" className="grid gap-12 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-12">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1d66f5]">
              <span className="h-2 w-2 rounded-full bg-[#1d66f5] animate-pulse"></span>
              SPK Bansos Metode TOPSIS
            </span>

            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl xl:text-7xl">
                Sistem Kelayakan <span className="bg-gradient-to-r from-[#1d66f5] to-[#0b4ed2] bg-clip-text text-transparent">Bansos</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Sistem pendukung keputusan untuk membantu proses seleksi calon penerima bantuan sosial secara objektif, transparan, dan terstruktur menggunakan algoritma TOPSIS.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/cek-data" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1d66f5] px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#1d66f5]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#0b4ed2] hover:shadow-[#0b4ed2]/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Cek Data Kelayakan
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Dashboard Admin
              </Link>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-[#1d66f5]/10 blur-3xl" />
            <div className="absolute -right-4 -bottom-4 h-72 w-72 rounded-full bg-[#22c55e]/10 blur-3xl" />
            
            <div className="relative rounded-[40px] border border-white bg-gradient-to-br from-white/80 to-white/40 p-3 shadow-2xl shadow-slate-200/50 backdrop-blur-md">
              <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1d66f5]/20 text-[#1d66f5]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">Validitas Tinggi</div>
                      <p className="text-sm font-bold text-white">Metode Terbuka & Adil</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">Aktif</span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="flex items-center gap-3 text-[#1d66f5]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7M15 17v-4" /></svg>
                      <h3 className="text-sm font-bold text-white">Kelola Data Penerima</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">Pemantauan profil calon kriteria secara terpusat.</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3V12" /></svg>
                      <h3 className="text-sm font-bold text-white">Penyimpanan Terstruktur</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">Infrastruktur data MariaDB yang aman dan mudah dilacak.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TENTANG SISTEM (BENTO GRID LAYOUT) */}
        <section id="tentang" className="space-y-12">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Tentang Sistem</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Sistem seleksi bantuan sosial menggunakan pendekatan ilmiah untuk menghasilkan rekomendasi peringkat yang adil dan transparan.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            
            {/* Card 1 - Big Highlight */}
            <div className="group rounded-[32px] bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] p-8 text-white md:col-span-2 lg:col-span-2 shadow-xl shadow-[#1d66f5]/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3 className="mt-8 text-xl font-black">Tujuan Utama Sistem</h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-100">
                Menghilangkan subjektivitas dalam pembagian bantuan sosial. Dengan pengujian berbasis kriteria nyata, sistem ini memastikan bantuan jatuh ke tangan yang benar-benar berhak secara tepat sasaran.
              </p>
            </div>

            {/* Card 2 - TOPSIS */}
            <div className="group rounded-[32px] border border-slate-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h4" /></svg>
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-900">Metode TOPSIS</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Mengukur alternatif terbaik berdasarkan jarak terdekat dari solusi ideal positif dan jarak terjauh dari solusi ideal negatif.
              </p>
            </div>

            {/* Card 3 - Database */}
            <div className="group rounded-[32px] border border-slate-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3V12" /></svg>
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-900">Data Relasional</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Seluruh data warga, parameter kriteria bobot, hingga kalkulasi skor akhir dienkripsi dan diorganisir rapi pada MariaDB.
              </p>
            </div>

            {/* Card 4 - Public Access (Wide on MD) */}
            <div className="group rounded-[32px] border border-slate-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/60 md:col-span-3 lg:col-span-4 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Keterbukaan Akses Publik</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Masyarakat luas dapat melakukan pemantauan mandiri secara instan dan berkala hanya dengan menginputkan NIK masing-masing pada halaman pencarian data.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: FAQ (SPLIT LAYOUT) */}
        <section id="faq" className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4 sticky top-6 h-fit">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1d66f5]">Pertanyaan Umum</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Ada Pertanyaan Mengenai Sistem?</h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Berikut rangkuman jawaban atas pertanyaan yang paling sering diajukan oleh pengguna maupun masyarakat umum.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Apakah masyarakat bisa login ke sistem?', a: 'Tidak. Hak akses login dashboard hanya diperuntukkan bagi Admin/Petugas dinas terkait. Masyarakat umum dapat memanfaatkan fitur Cek Data tanpa perlu akun.' },
              { q: 'Siapa yang berwenang menginput data kriteria?', a: 'Pengisian kriteria nilai, perubahan bobot kepentingan, dan pendaftaran warga baru sepenuhnya dikelola oleh Administrator sistem yang terverifikasi.' },
              { q: 'Apa bentuk output dari penilaian TOPSIS ini?', a: 'Sistem menyajikan luaran status klasifikasi akhir yang objektif, mulai dari kategori Sangat Layak, Layak, Dipertimbangkan, hingga Tidak Layak.' },
              { q: 'Apakah perhitungan peringkat berjalan otomatis?', a: 'Ya. Begitu matriks nilai kriteria dilengkapi oleh admin, algoritma backend akan langsung memproses kalkulasi perangkingan secara *real-time*.' },
            ].map((item, index) => (
              <div key={index} className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:border-slate-300">
                <div className="flex gap-4">
                  <span className="text-xl font-black text-slate-300 group-hover:text-[#1d66f5] transition duration-300">0{index + 1}</span>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: KONTAK (CREATIVE WRAPPER) */}
        <section id="kontak" className="rounded-[40px] bg-slate-900 p-8 text-white sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#1d66f5]/20 blur-3xl" />
          
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Hubungi Layanan Operasional</h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Sistem pendukung keputusan ini dikembangkan untuk simulasi serta implementasi tata kelola verifikasi kelayakan bantuan sosial yang kredibel.
              </p>
              <div className="pt-4">
                <span className="inline-block rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-slate-300">
                  ⚡ Respons Cepat Jam Kerja
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Instansi Pengelola', val: 'Dinas Sosial Komunitas' },
                { label: 'Surel Resmi', val: 'admin@bansos.local' },
                { label: 'Waktu Operasional', val: 'Senin - Jumat, 08.00 - 16.00 WIB' },
                { label: 'Alamat Kantor', val: 'Gedung Pusat Pelayanan Sosial, Lt. 2' },
              ].map((info) => (
                <div key={info.label} className="rounded-2xl bg-white/5 p-5 border border-white/5 backdrop-blur-sm">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">{info.label}</span>
                  <p className="mt-1.5 text-sm font-bold text-white">{info.val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/60 bg-white py-8 text-sm text-slate-500">
        <div className="mx-auto flex flex-col gap-4 px-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left xl:max-w-[1200px]">
          <span className="font-medium">© 2026 Sistem Kelayakan Bansos. All rights reserved.</span>
          <span className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600">Tentang</a>·
            <a href="#" className="hover:text-slate-600">Kebijakan Privasi</a>·
            <a href="#" className="hover:text-slate-600">Syarat Ketentuan</a>·
            <a href="#" className="hover:text-slate-600">Kontak</a>
          </span>
        </div>
      </footer>
    </div>
  );
}