import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface LayoutProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

interface UserSession {
  id: number;
  nama: string;
  username: string;
  role: string;
}

const menus = [
  {
    path: "/dashboard",
    label: "Dashboard",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
  },
  {
    path: "/warga",
    label: "Warga",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  },
  {
    path: "/kriteria",
    label: "Kriteria",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
  },
  {
    path: "/penilaian",
    label: "Penilaian",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  },
  {
    path: "/perhitungan",
    label: "Hasil Penilaian",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  },
  {
    path: "/ranking",
    label: "Ranking",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
  },
  {
    path: "/laporan",
    label: "Laporan",
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  }
];

export default function Layout({
  title,
  subtitle,
  right,
  children
}: LayoutProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Mengambil session aktif petugas lapangan saat komponen dimuat
  useEffect(() => {
    const sessionData = localStorage.getItem("user_session");
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Gagal parse session user:", e);
      }
    }
  }, []);

  function logout() {
    // PERBAIKAN: Bersihkan seluruh flag auth & session tersimpan agar tidak duplikat
    localStorage.removeItem("bansos-auth");
    localStorage.removeItem("user_session");
    navigate("/login");
  }

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Default display values jika session kosong murni
  const userNama = currentUser ? currentUser.nama : "Admin Dinas";
  const userRole = currentUser ? currentUser.role : "Administrator";
  const avatarLetter = userNama.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen grid lg:grid-cols-[280px_1fr] bg-[#f8faff]">
      
      {/* SIDEBAR */}
      <aside className="bg-gradient-to-b from-[#0a1e3d] to-[#051021] text-white p-6 flex flex-col justify-between border-r border-slate-800/40 shadow-xl z-20">
        <div>
          {/* BRAND */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-[14px] grid place-items-center bg-gradient-to-br from-[#1d66f5] to-[#0b4ed2] text-white text-base font-black shadow-md shadow-blue-500/20">
              ✓
            </div>
            <div>
              <strong className="block text-sm font-black tracking-tight text-white">SPK Kelayakan</strong>
              <span className="text-[11px] font-bold text-slate-400 tracking-wider">Bansos Terpadu</span>
            </div>
          </div>

          {/* MENU */}
          <nav className="space-y-1.5">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200 relative group
                  ${isActive
                    ? "bg-white/12 text-white shadow-sm shadow-black/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#1d66f5] rounded-r-md" />
                    )}
                    <span className={`transition-colors duration-200 ${isActive ? "text-[#1d66f5]" : "text-slate-400 group-hover:text-slate-200"}`}>
                      {item.svg}
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* DYNAMIC USER PROFILE INFO */}
        <div className="border-t border-white/10 pt-5 mt-8 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            {/* Avatar dibuat dinamis berdasarkan huruf pertama nama petugas */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white grid place-items-center font-black text-sm shadow-md uppercase">
              {avatarLetter}
            </div>
            <div>
              <strong className="block text-xs font-bold text-white tracking-wide truncate max-w-[140px]" title={userNama}>
                {userNama}
              </strong>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {userRole}
              </span>
            </div>
          </div>

          <button
            className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 grid place-items-center transition duration-200"
            onClick={logout}
            title="Keluar Aplikasi"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* CONTENT WORKSPACE */}
      <main className="p-8 lg:p-11 overflow-y-auto max-h-screen">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[9px] font-black text-[#1d66f5] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1d66f5]" />
              Panel Utama Sistem
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {right || (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 shadow-sm backdrop-blur-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {today}
            </div>
          )}
        </div>

        <div className="animate-fade-in">
          {children}
        </div>
      </main>

    </div>
  );
}