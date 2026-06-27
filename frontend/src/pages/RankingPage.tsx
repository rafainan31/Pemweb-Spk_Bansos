import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { RankingResult } from "../types";
import { formatNumber } from "../utils/format";

export default function RankingPage() {
  const [results, setResults] = useState<RankingResult[]>([]);
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const data = await api.getTopsis();
      setResults(data.results);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menghitung ranking');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = statusFilter === 'Semua Status' ? results : results.filter((item) => item.status === statusFilter);
  const best = results[0];

  return (
    <Layout
      title="Hasil Ranking TOPSIS"
      subtitle="Hasil perankingan akhir kelayakan penerima bansos dari MariaDB"
      right={
        <div className="toolbar right">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Semua Status</option>
            <option>Sangat Layak</option>
            <option>Layak</option>
            <option>Dipertimbangkan</option>
            <option>Tidak Layak</option>
          </select>
          <button className="btn outline" onClick={loadData}>Refresh</button>
        </div>
      }
    >
      {message && <div className="info-box">{message}</div>}
      <div className="ranking-layout">
        <div className="card table-card">
          <table>
            <thead><tr><th>Ranking</th><th>Kode</th><th>Nama</th><th>NIK</th><th>Nilai Preferensi</th><th>Status Kelayakan</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>Belum ada data ranking. Input data di halaman Penilaian.</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank}</td>
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

        <aside className="best-card">
          <h3>Alternatif Terbaik</h3>
          {best ? (
            <>
              <div className="winner-badge">{best.code}</div>
              <h2>{best.nama}</h2>
              <div className="score-box">
                <span>Nilai Preferensi</span>
                <strong>{formatNumber(best.preference)}</strong>
                <Badge>{best.status}</Badge>
              </div>
              <div className="summary-list">
                <p><span>Total Dinilai</span><b>{results.length}</b></p>
                <p><span>Sangat Layak</span><b>{results.filter((x) => x.status === 'Sangat Layak').length}</b></p>
                <p><span>Layak</span><b>{results.filter((x) => x.status === 'Layak').length}</b></p>
                <p><span>Dipertimbangkan</span><b>{results.filter((x) => x.status === 'Dipertimbangkan').length}</b></p>
                <p><span>Tidak Layak</span><b>{results.filter((x) => x.status === 'Tidak Layak').length}</b></p>
              </div>
            </>
          ) : (
            <div className="empty-state">Belum ada alternatif terbaik.</div>
          )}
        </aside>
      </div>
    </Layout>
  );
}
