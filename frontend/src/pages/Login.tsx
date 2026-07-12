import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Tembak endpoint login resmi ke backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: identifier, // Mengirim input dari field 'Email atau Username'
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal melakukan autentikasi");
      }

      // 2. Jika sukses, simpan flag auth standard dan DATA USER utuh dari backend
      localStorage.setItem('bansos-auth', 'true');
      localStorage.setItem('user_session', JSON.stringify(data.user)); // Menyimpan ID dan Nama Petugas

      // 3. Alihkan petugas ke halaman dashboard utama
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen grid place-items-center px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 font-sans antialiased">
      
      {/* Floating Back Button to Dashboard Root "/" */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-slate-200/60 shadow-sm text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all duration-200 group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Kembali
      </button>

      <div className="w-full max-w-[940px] bg-white border border-slate-100 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(15,31,61,0.06)] overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Form Section */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between gap-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex lg:flex mb-6 w-12 h-12 rounded-2xl items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Sistem Kelayakan<br className="hidden lg:block"/> Bansos
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Masuk sebagai Administrator / Petugas</p>
          </div>

          <div className="grid gap-2">
            {/* ALERT BILA ERROR LOGIN GAGAL */}
            {error && (
              <div className="p-4 mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl font-semibold text-center transition-all">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Email atau Username</span>
                <input 
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 disabled:opacity-60" 
                  placeholder="Masukkan email atau username" 
                />
              </div>

              <div className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 placeholder:text-slate-400 disabled:opacity-60" 
                  placeholder="Masukkan password" 
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 font-medium text-slate-600 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer" />
                  Ingat saya
                </label>
                <a className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors" href="#">Lupa password?</a>
              </div>

              <button 
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-600/15 hover:shadow-blue-600/20 hover:brightness-95 active:scale-[0.99] transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>
          </div>

          <p className="text-center lg:text-left text-xs text-slate-400 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Dinas Sosial Pemerintah. Hak Cipta Dilindungi.
          </p>
        </div>

        {/* Dynamic Visual Section (Right Side) */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-900 hidden lg:flex items-center justify-center p-12 overflow-hidden">
          {/* Subtle Abstract Decorative Background Rings */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none blur-3xl" />
          
          <div className="relative z-10 text-white max-w-xs text-center grid gap-4">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🛡
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-2">Autentikasi Dua Arah</h3>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
              Sistem terenkripsi penuh untuk memastikan data verifikasi kemiskinan warga tetap aman, valid, dan transparan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}