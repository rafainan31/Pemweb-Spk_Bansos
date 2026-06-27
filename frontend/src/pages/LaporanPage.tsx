import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { RankingResult } from "../types";
import { formatNumber } from "../utils/format";

function downloadCSV(rows: RankingResult[]) {
  const header = ['Ranking', 'Kode', 'Nama', 'NIK', 'Nilai Preferensi', 'Status'];
  const body = rows.map((row) => [row.rank, row.code, row.nama, row.nik, formatNumber(row.preference), row.status]);
  const csv = [header, ...body].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'laporan-bansos-topsis.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function LaporanPage() {
  const [results, setResults] = useState<RankingResult[]>([]);
  const [status, setStatus] = useState('Semua Status');
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const data = await api.getTopsis();
      setResults(data.results);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil laporan');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => status === 'Semua Status' ? results : results.filter((item) => item.status === status), [results, status]);

  return (
    <Layout title="Laporan Hasil Penilaian" subtitle="Cetak dan unduh laporan hasil kelayakan bansos">
      <div className="card report-filter">
        <label>Periode
          <input value="01/05/2025 - 27/05/2025" readOnly />
        </label>
        <label>Status Kelayakan
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Semua Status</option>
            <option>Sangat Layak</option>
            <option>Layak</option>
            <option>Dipertimbangkan</option>
            <option>Tidak Layak</option>
          </select>
        </label>
        <button className="btn primary" onClick={loadData}>Tampilkan</button>
      </div>

      {message && <div className="info-box">{message}</div>}

      <div className="stats-grid report-stats">
        <div className="mini-stat"><span>Total Dinilai</span><b>{results.length}</b></div>
        <div className="mini-stat"><span>Sangat Layak</span><b>{results.filter((x) => x.status === 'Sangat Layak').length}</b></div>
        <div className="mini-stat"><span>Layak</span><b>{results.filter((x) => x.status === 'Layak').length}</b></div>
        <div className="mini-stat"><span>Dipertimbangkan</span><b>{results.filter((x) => x.status === 'Dipertimbangkan').length}</b></div>
        <div className="mini-stat"><span>Tidak Layak</span><b>{results.filter((x) => x.status === 'Tidak Layak').length}</b></div>
      </div>

      <div className="card table-card">
        <div className="card-head">
          <h3>Tabel Laporan</h3>
          <div className="export-actions">
            <button className="btn danger" onClick={() => window.print()}>Export PDF</button>
            <button className="btn success" onClick={() => downloadCSV(filtered)}>Export Excel</button>
            <button className="btn outline" onClick={() => window.print()}>Cetak</button>
          </div>
        </div>
        <table>
          <thead><tr><th>Ranking</th><th>Kode</th><th>Nama</th><th>NIK</th><th>Nilai Preferensi</th><th>Status Kelayakan</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}>Belum ada data laporan.</td></tr>
            ) : filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.rank}</td>
                <td>{row.code}</td>
                <td>{row.nama}</td>
                <td>{row.nik}</td>
                <td>{formatNumber(row.preference)}</td>
                <td><Badge>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">Menampilkan {filtered.length} dari {results.length} data</div>
      </div>
    </Layout>
  );
}
