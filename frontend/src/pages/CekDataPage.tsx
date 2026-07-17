import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

interface WargaResponse {
  id: number;
  code: string;
  nama: string;
  nik: string;
  alamat: string;
  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
  status: string;
  scores: Record<string, number>;
  nilai_saw?: number;
  nilai_wp?: number;
  nilai_topsis?: number;
  ranking?: number;
  dPlus?: number;
  dMinus?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function CekDataPage() {
  const [wargaList, setWargaList] = useState<WargaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // State untuk form input pencarian sesuai screenshot
  const [inputNama, setInputNama] = useState("");
  const [inputNik, setInputNik] = useState("");
  
  // State untuk menyimpan data hasil pencarian setelah tombol diklik
  const [hasilEkstraksi, setHasilEkstraksi] = useState<WargaResponse | null>(null);
  const [sudahMencari, setSudahMencari] = useState(false);
  
  // State untuk admin mode search
  const [searchQuery, setSearchQuery] = useState("");

  // Filter warga untuk mode admin
  const filteredWarga = wargaList.filter((warga) => {
    const query = searchQuery.toLowerCase();
    return (
      warga.nama.toLowerCase().includes(query) ||
      warga.nik.includes(query) ||
      warga.code.toLowerCase().includes(query)
    );
  });

  async function loadWargaData() {
    try {
      setLoading(true);
      const data = await api.getWarga();
      setWargaList(data as WargaResponse[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat basis data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWargaData();
  }, []);

  // Fungsi saat tombol EKSTRAK NILAI MATRIKS diklik
  const handleEkstrak = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSudahMencari(true);

    if (!inputNama.trim() && !inputNik.trim()) {
      setMessage("Silakan isi Nama Lengkap atau NIK terlebih dahulu.");
      setHasilEkstraksi(null);
      return;
    }

    // Mencari warga yang cocok secara presisi
    const ditemukan = wargaList.find((warga) => {
      const matchNama = inputNama.trim() 
        ? warga.nama.toLowerCase().includes(inputNama.toLowerCase().trim()) 
        : true;
      const matchNik = inputNik.trim() 
        ? warga.nik.trim() === inputNik.trim() 
        : true;
      return matchNama && matchNik;
    });

    if (ditemukan) {
      setHasilEkstraksi(ditemukan);
    } else {
      setHasilEkstraksi(null);
    }
  };

  const handleReset = () => {
    setInputNama("");
    setInputNik("");
    setHasilEkstraksi(null);
    setSudahMencari(false);
    setMessage("");
  };

  const maskNik = (nikStr: string) => {
    if (!nikStr) return "-";
    const clean = String(nikStr).trim();
    if (clean.length < 8) return clean;
    return `${clean.slice(0, 5)}******${clean.slice(-4)}`;
  };

  // Deteksi session login admin
  const token = localStorage.getItem("user_session") || localStorage.getItem("user") || localStorage.getItem("userData");
  const isUserAdmin = !!token;

  // TAMPILAN MODE PUBLIK (FORM SIMPEL SESUAI SCREENSHOT)
  if (!isUserAdmin) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f0f4f8", minHeight: "100vh", fontFamily: "sans-serif" }}>
        {/* Top Navbar Publik */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "0.75rem 1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => window.location.href = "/"} style={{ border: "none", background: "#f1f5f9", borderRadius: "0.375rem", padding: "0.5rem 0.75rem", cursor: "pointer" }}>←</button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ backgroundColor: "#2563eb", color: "white", borderRadius: "0.375rem", padding: "0.375rem", fontWeight: "bold", display: "inline-block" }}>✓</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Sistem Kelayakan</strong>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Bantuan Sosial</span>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.href = "/login"} style={{ backgroundColor: "#0f172a", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "0.85rem" }}>
            LOGIN ADMIN PORTAL
          </button>
        </div>

        {/* Card Utama Form Pencarian */}
        <div style={{ maxWidth: "760px", margin: "0 auto", backgroundColor: "white", padding: "2.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ color: "#2563eb", fontWeight: "bold", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", backgroundColor: "#eff6ff", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
              • Mesin Komparasi Kuantitatif
            </span>
            <h1 style={{ fontSize: "2rem", color: "#0f172a", marginTop: "0.75rem", marginBottom: "0.5rem" }}>Cek Skor Multi-Metode</h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
              Transparansi parameter nilai hasil ekstraksi algoritma pengambil keputusan <strong>SAW, WP,</strong> dan <strong>TOPSIS</strong> secara objektif.
            </p>
          </div>

          <form onSubmit={handleEkstrak} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>Nama Lengkap Sesuai KTP</label>
              <input 
                type="text" 
                placeholder="Ruswanto"
                value={inputNama}
                onChange={(e) => setInputNama(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.95rem", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>Nomor Induk Kependudukan (NIK)</label>
              <input 
                type="text" 
                placeholder="123456123456"
                value={inputNik}
                onChange={(e) => setInputNik(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.95rem", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ gridColumn: "span 2", display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="submit" style={{ flex: 3, backgroundColor: "#2563eb", color: "white", border: "none", padding: "0.85rem", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "0.95rem" }}>
                {loading ? "Memproses..." : "EKSTRAK NILAI MATRIKS"}
              </button>
              <button type="button" onClick={handleReset} style={{ flex: 1, backgroundColor: "white", color: "#334155", border: "1px solid #cbd5e1", padding: "0.85rem", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "0.95rem" }}>
                ⟳ Reset Form
              </button>
            </div>
          </form>

          {message && (
            <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "0.5rem", fontSize: "0.875rem", marginBottom: "1.5rem", border: "1px solid #fee2e2" }}>
              ⚠️ {message}
            </div>
          )}

          {/* AREA DOKUMENTASI EKSTRAKSI HASIL (MUNCUL SETELAH DI-SUBMIT) */}
          {sudahMencari && (
            <div style={{ marginTop: "2rem", borderTop: "2px dashed #e2e8f0", paddingTop: "1.5rem" }}>
              {hasilEkstraksi ? (
                <div>
                  <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#334155" }}>Hasil Autentikasi Sistem:</h4>
                    <table style={{ width: "100%", fontSize: "0.9rem", color: "#475569" }}>
                      <tbody>
                        <tr><td>Kode Alternatif</td><td>: <strong>{hasilEkstraksi.code}</strong></td></tr>
                        <tr><td>Nama Lengkap</td><td>: {hasilEkstraksi.nama}</td></tr>
                        <tr><td>NIK (Protected)</td><td>: <code style={{ letterSpacing: "0.5px" }}>{maskNik(hasilEkstraksi.nik)}</code></td></tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 style={{ color: "#0f172a", marginBottom: "0.75rem" }}>Nilai Ekstraksi Parameter Multi-Metode:</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div style={{ textAlign: "center", padding: "1rem", background: "#f0fdf4", borderRadius: "0.5rem", border: "1px solid #bbf7d0" }}>
                      <span style={{ fontSize: "0.75rem", color: "#166534", fontWeight: "bold" }}>SKOR SAW</span>
                      <h2 style={{ margin: "0.25rem 0 0 0", color: "#15803d" }}>{(hasilEkstraksi.nilai_saw ?? 0).toFixed(4)}</h2>
                    </div>
                    <div style={{ textAlign: "center", padding: "1rem", background: "#fffbeb", borderRadius: "0.5rem", border: "1px solid #fef3c7" }}>
                      <span style={{ fontSize: "0.75rem", color: "#92400e", fontWeight: "bold" }}>SKOR WP</span>
                      <h2 style={{ margin: "0.25rem 0 0 0", color: "#b45309" }}>{(hasilEkstraksi.nilai_wp ?? 0).toFixed(4)}</h2>
                    </div>
                    <div style={{ textAlign: "center", padding: "1rem", background: "#eff6ff", borderRadius: "0.5rem", border: "1px solid #bfdbfe" }}>
                      <span style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: "bold" }}>SKOR TOPSIS</span>
                      <h2 style={{ margin: "0.25rem 0 0 0", color: "#1d4ed8" }}>{(hasilEkstraksi.nilai_topsis ?? 0).toFixed(4)}</h2>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", color: "#64748b" }}>
                  ❌ Data warga tidak ditemukan. Pastikan kecocokan nama dan NIK sudah benar.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🔒 2. TAMPILAN MODE ADMIN LENGKAP (TETAP SEPERTI ATURAN AWAL JIKA SUDAH LOGIN ADMIN)
  return (
    <Layout
      title="Cek Hasil & Data Penilaian (Mode Admin)"
      subtitle="Halaman verifikasi detail nilai skor parameter dan metrik jarak matriks ideal TOPSIS warga."
    >
      <div className="card glass-card">
        <div className="card-head">
          <div>
            <h3>Daftar Evaluasi Alternatif</h3>
            <p className="muted-text">Gunakan kolom pencarian untuk mempercepat verifikasi NIK atau Kode Alternatif.</p>
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Cari berdasarkan nama, NIK atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {message && <div className="info-box error-box">{message}</div>}

        {loading ? (
          <div className="empty-state">Memproses dan memuat matriks keputusan...</div>
        ) : filteredWarga.length === 0 ? (
          <div className="empty-state">Data warga tidak ditemukan atau belum dinilai.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Kode</th>
                  <th>Nama Lengkap</th>
                  <th>NIK Asli</th>
                  <th>C1</th>
                  <th>C2</th>
                  <th>C3</th>
                  <th>C4</th>
                  <th>C5</th>
                  <th>C6</th>
                  <th>D+</th>
                  <th>D-</th>
                  <th>TOPSIS</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarga.map((warga) => (
                  <tr key={warga.id}>
                    <td><span className="rank-badge">{warga.ranking ?? "-"}</span></td>
                    <td>{warga.code}</td>
                    <td><strong>{warga.nama}</strong></td>
                    <td className="muted-text">{warga.nik}</td>
                    <td>{warga.scores?.C1 ?? 0}</td>
                    <td>{warga.scores?.C2 ?? 0}</td>
                    <td>{warga.scores?.C3 ?? 0}</td>
                    <td>{warga.scores?.C4 ?? 0}</td>
                    <td>{warga.scores?.C5 ?? 0}</td>
                    <td>{warga.scores?.C6 ?? 0}</td>
                    <td className="text-danger">{(warga.dPlus ?? 0).toFixed(4)}</td>
                    <td className="text-success">{(warga.dMinus ?? 0).toFixed(4)}</td>
                    <td><span className="badge primary">{(warga.nilai_topsis ?? 0).toFixed(4)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}