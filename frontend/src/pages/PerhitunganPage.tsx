import { useEffect, useState } from "react";
import Badge from "../components/Badge.js";
import Layout from "../components/Layout.js";
import { api } from "../services/api.js";
import { Criteria, RankingResult, TopsisResponse } from "../types.js";
import { formatNumber } from "../utils/format.js";

export default function PerhitunganPage() {
  const [data, setData] = useState<TopsisResponse | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setMessage('');
    setLoading(true);

    try {
      const response = await api.getTopsis();
      setData(response);
    } catch (error) {
      setData(null);
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil perhitungan TOPSIS');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const criteria: Criteria[] = data?.criteria || [];
  const results: RankingResult[] = data?.results || [];

  return (
    <Layout
      title="Perhitungan TOPSIS"
      subtitle="Perhitungan menggunakan normalisasi vektor, bobot ternormalisasi, solusi ideal, dan nilai preferensi."
      right={<button className="btn primary" onClick={loadData}>Hitung Ulang</button>}
    >
      {message && <div className="info-box">{message}</div>}

      <div className="steps premium-steps">
        <div className="step done">1<span>Matriks Keputusan</span></div>
        <div className="step done">2<span>Normalisasi</span></div>
        <div className="step done">3<span>Bobot Normal</span></div>
        <div className="step done">4<span>Solusi Ideal</span></div>
        <div className="step active">5<span>Jarak Separasi</span></div>
        <div className="step active">6<span>Nilai Preferensi</span></div>
      </div>

      {!data || results.length === 0 ? (
        <div className="card empty-state">
          {loading ? 'Memuat perhitungan TOPSIS...' : 'Belum ada data penilaian untuk dihitung.'}
        </div>
      ) : (
        <>
          <div className="card table-card premium-table">
            <div className="card-head">
              <div>
                <h3>Kriteria dan Bobot Normal</h3>
                <p className="muted-text">Bobot 5, 4, 3, 3, 4, 5 dinormalisasi menjadi total 1 agar perhitungan TOPSIS akurat.</p>
              </div>
              <Badge variant="success">Total Bobot: {data.weightSum}</Badge>
            </div>
            <table>
              <thead><tr><th>Kode</th><th>Kriteria</th><th>Bobot Nilai</th><th>Bobot Normal</th><th>Tipe</th></tr></thead>
              <tbody>
                {criteria.map((item) => (
                  <tr key={item.id}>
                    <td><span className="kode-badge">{item.code}</span></td>
                    <td><b>{item.name}</b></td>
                    <td>{item.weight}</td>
                    <td><b>{formatNumber(data.normalizedWeights[item.code])}</b></td>
                    <td><Badge variant={item.type === 'benefit' ? 'success' : 'warning'}>{item.type.toUpperCase()}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="calc-grid">
            <div className="card small-table">
              <h3>Solusi Ideal Positif (A+)</h3>
              <table>
                <thead><tr><th>Kriteria</th><th>Nilai</th></tr></thead>
                <tbody>
                  {criteria.map((item) => (
                    <tr key={item.code}><td>{item.code} - {item.name}</td><td>{formatNumber(data.idealPositive[item.code])}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card small-table">
              <h3>Solusi Ideal Negatif (A-)</h3>
              <table>
                <thead><tr><th>Kriteria</th><th>Nilai</th></tr></thead>
                <tbody>
                  {criteria.map((item) => (
                    <tr key={item.code}><td>{item.code} - {item.name}</td><td>{formatNumber(data.idealNegative[item.code])}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card small-table">
              <h3>Jarak Separasi</h3>
              <table>
                <thead><tr><th>Alternatif</th><th>D+</th><th>D-</th></tr></thead>
                <tbody>
                  {data.distances.slice(0, 8).map((item) => (
                    <tr key={item.id}><td>{item.code}</td><td>{formatNumber(item.dPlus)}</td><td>{formatNumber(item.dMinus)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card table-card premium-table">
            <div className="card-head">
              <div>
                <h3>Nilai Preferensi</h3>
                <p className="muted-text">Rumus: V = D- / (D+ + D-). Nilai paling besar menjadi ranking tertinggi.</p>
              </div>
            </div>
            <table>
              <thead><tr><th>Ranking</th><th>Kode</th><th>Nama</th><th>D+</th><th>D-</th><th>Preferensi</th><th>Status</th></tr></thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td><b>{item.rank}</b></td>
                    <td>{item.code}</td>
                    <td>{item.nama}</td>
                    <td>{formatNumber(item.dPlus)}</td>
                    <td>{formatNumber(item.dMinus)}</td>
                    <td><b>{formatNumber(item.preference)}</b></td>
                    <td><Badge>{item.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}
