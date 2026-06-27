import { CSSProperties, useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import { SummaryResponse } from "../types";
import { formatNumber } from "../utils/format";

const initialSummary: SummaryResponse = {
  totalWarga: 0,
  sudahDinilai: 0,
  sangatLayak: 0,
  layak: 0,
  dipertimbangkan: 0,
  tidakLayak: 0,
  prioritas: []
};

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryResponse>(initialSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSummary()
      .then(setSummary)
      .catch(() => setSummary(initialSummary))
      .finally(() => setLoading(false));
  }, []);

  const totalResult = summary.sangatLayak + summary.layak + summary.dipertimbangkan + summary.tidakLayak;
  const layakTotal = summary.sangatLayak + summary.layak;
  const percent = totalResult ? Math.round((layakTotal / totalResult) * 100) : 0;
  const donutStyle = { '--percent': percent } as CSSProperties;

  const bars = useMemo(() => {
    const data = [
      { label: 'Sangat Layak', value: summary.sangatLayak },
      { label: 'Layak', value: summary.layak },
      { label: 'Dipertimbangkan', value: summary.dipertimbangkan },
      { label: 'Tidak Layak', value: summary.tidakLayak }
    ];
    const max = Math.max(...data.map((item) => item.value), 1);
    return data.map((item) => ({ ...item, height: Math.max(42, Math.round((item.value / max) * 210)) }));
  }, [summary]);

  return (
    <Layout title="Dashboard" subtitle="Ringkasan SPK penerima bansos berdasarkan kriteria C1-C6 dan metode TOPSIS.">
      {loading && <div className="info-box">Mengambil data dari MariaDB...</div>}

      <div className="hero-panel">
        <div>
          <span className="eyebrow">Sistem Pendukung Keputusan</span>
          <h2>Kelayakan Bantuan Sosial</h2>
          <p>Ranking otomatis dihitung dari pendapatan, daya listrik, kondisi rumah, kendaraan, dan komponen PKH.</p>
        </div>
        <div className="hero-metric"><b>{percent}%</b><span>Layak dari data dinilai</span></div>
      </div>

      <div className="stats-grid">
        <StatCard icon="◉" label="Total Warga" value={summary.totalWarga} note="Orang" />
        <StatCard icon="✓" label="Sudah Dinilai" value={summary.sudahDinilai} note="Data tersimpan" />
        <StatCard icon="▲" label="Lolos Kelayakan" value={layakTotal} note="Sangat layak + layak" color="green" />
        <StatCard icon="!" label="Tidak Lolos" value={summary.tidakLayak} note="Tidak layak" color="red" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Distribusi Status Kelayakan</h3>
          <div className="bar-chart">
            {bars.map((bar) => (
              <div key={bar.label} style={{ height: `${bar.height}px` }}><b>{bar.value}</b><span>{bar.label}</span></div>
            ))}
          </div>
        </div>

        <div className="card center-card">
          <h3>Persentase Kelayakan</h3>
          <div className="donut" style={donutStyle}><span>{percent}%</span></div>
          <p><Badge variant="success">Layak</Badge> {layakTotal} data</p>
          <p><Badge variant="danger">Tidak Layak</Badge> {summary.tidakLayak} data</p>
        </div>
      </div>

      <div className="card table-card premium-table">
        <div className="card-head">
          <h3>Penerima Prioritas</h3>
          <a className="btn outline" href="/ranking">Lihat Semua</a>
        </div>
        <table>
          <thead><tr><th>Ranking</th><th>Kode</th><th>Nama</th><th>Nilai Preferensi</th><th>Status</th></tr></thead>
          <tbody>
            {summary.prioritas.length === 0 ? (
              <tr><td colSpan={5}>Belum ada data penilaian. Input data di halaman Penilaian.</td></tr>
            ) : summary.prioritas.map((row) => (
              <tr key={row.id}>
                <td><b>{row.rank}</b></td>
                <td><span className="kode-badge">{row.code}</span></td>
                <td>{row.nama}</td>
                <td>{formatNumber(row.preference)}</td>
                <td><Badge>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
