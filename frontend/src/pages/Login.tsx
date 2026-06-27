import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem('bansos-auth', 'true');
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-8 bg-[radial-gradient(circle_at_top,_rgba(233,243,255,0.9),_rgba(248,251,255,0.94)_54%,_#eef5ff)]">
      <div className="grid lg:grid-cols-[1fr_1fr] w-full max-w-[880px] bg-white/80 backdrop-blur-[20px] border border-slate-200/80 rounded-[28px] shadow-[0_26px_40px_rgba(15,31,61,0.08)] overflow-hidden">
        <div className="p-8 grid gap-6">
          <div className="text-center">
            <div className="mx-auto mb-5 w-14 h-14 rounded-[20px] grid place-items-center bg-[#1d66f5] text-white text-2xl shadow-sm">❤</div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Sistem Kelayakan<br />Bansos</h1>
            <p className="mt-3 text-sm text-slate-500">Login Admin</p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email atau Username
              <input className="w-full rounded-[18px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1d66f5] focus:ring-4 focus:ring-[#1d66f5]/10" placeholder="Masukkan email atau username" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Password
              <input type="password" className="w-full rounded-[18px] border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1d66f5] focus:ring-4 focus:ring-[#1d66f5]/10" placeholder="Masukkan password" />
            </label>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1d66f5] focus:ring-[#1d66f5]" />
                Ingat saya
              </label>
              <a className="text-[#1d66f5] hover:underline" href="#">Lupa password?</a>
            </div>
            <button className="w-full rounded-[13px] bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] px-6 py-3 text-sm font-black uppercase text-white transition duration-200 hover:brightness-95" type="submit">
              Login
            </button>
          </form>
          <small className="text-center text-xs text-slate-500">© 2025 Pemerintah. Semua hak dilindungi.</small>
        </div>
        <div className="relative p-8 bg-[#eef5ff] hidden lg:block">
          <div className="absolute left-14 top-20 w-[190px] h-[135px] rounded-[24px] bg-white shadow-[0_22px_35px_rgba(15,94,245,0.23)] grid place-items-center text-6xl">🔒</div>
          <div className="absolute right-12 top-10 w-24 h-24 rounded-[32px] bg-[#1d66f5] grid place-items-center text-3xl text-white shadow-xl">✓</div>
        </div>
      </div>
    </div>
  );
}
