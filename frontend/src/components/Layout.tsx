import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface LayoutProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

const menus = [
  { path: '/dashboard', label: 'Dashboard', icon: '⌘' },
  { path: '/warga', label: 'Warga', icon: '◉' },
  { path: '/kriteria', label: 'Kriteria', icon: '▦' },
  { path: '/penilaian', label: 'Penilaian', icon: '✦' },
  { path: '/perhitungan', label: 'Perhitungan', icon: '∑' },
  { path: '/ranking', label: 'Ranking', icon: '♛' },
  { path: '/laporan', label: 'Laporan', icon: '▣' }
];

export default function Layout({ title, subtitle, right, children }: LayoutProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('bansos-auth');
    navigate('/login');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[276px_1fr] bg-slate-50">
      <aside className="bg-gradient-to-b from-[#062b61] to-[#041a3d] text-white p-6 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-[14px] grid place-items-center bg-white/10 text-white text-lg font-black">◆</div>
          <div>
            <strong className="block text-sm font-black">SPK Kelayakan</strong>
            <span className="text-xs text-slate-300">Bansos TOPSIS</span>
          </div>
        </div>

        <nav className="grid gap-2">
          {menus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition duration-200 ${
                  isActive ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="w-9 h-9 rounded-2xl bg-white/10 grid place-items-center text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/15 pt-5 grid grid-cols-[42px_1fr_auto] items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-[#0d4b9a] grid place-items-center font-black">A</div>
          <div>
            <strong className="block text-sm">Admin Dinas</strong>
            <span className="text-xs text-slate-300">Administrator</span>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-white text-[#0d4b9a] grid place-items-center transition duration-200 hover:bg-slate-100"
            onClick={logout}
            title="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      <main className="p-8 lg:p-10 bg-[#f4f8ff]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.18em] text-[10px] font-black text-[#1d66f5]">
              Panel Administrator
            </span>
            <h1 className="mt-3 text-3xl font-black text-slate-900">{title}</h1>
            {subtitle && <p className="mt-3 text-sm text-slate-600 max-w-2xl">{subtitle}</p>}
          </div>
          {right || <div className="inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">Rabu, 24 Juni 2026</div>}
        </div>
        {children}
      </main>
    </div>
  );
}
