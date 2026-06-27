import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { Criteria } from "../types";

export default function KriteriaPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const data = await api.getCriteria();
      setCriteria(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil kriteria');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalBobot = criteria.reduce((sum, item) => sum + Number(item.weight), 0);

  async function updateWeight(id: number, weight: number, type: 'benefit' | 'cost') {
    try {
      const result = await api.updateCriteria(id, { weight, type });
      setCriteria(result.data);
      setMessage('Kriteria berhasil diperbarui.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal memperbarui kriteria');
    }
  }

  return (
    <Layout
      title="Data Kriteria & Bobot Parameter"
      subtitle="Konfigurasi bobot kepentingan C1-C6 untuk metode TOPSIS kelayakan bansos."
      right={<button className="btn primary" onClick={loadData}>Refresh Kriteria</button>}
    >
      {message && <div className="info-box">{message}</div>}

      <div className="rule-grid">
        <div className="info-box no-margin">
          <b>Benefit</b><br />Semakin besar nilai skor, alternatif semakin layak mendapat bantuan.
        </div>
        <div className="info-box no-margin warning-box">
          <b>Cost</b><br />Semakin besar nilai skor, alternatif semakin tidak layak dibantu.
        </div>
      </div>

      <div className="card table-card premium-table">
        <table>
          <thead><tr><th>No</th><th>Kode</th><th>Nama Parameter Kriteria</th><th>Bobot Nilai</th><th>Bobot Normal</th><th>Jenis Aturan</th><th>Aksi</th></tr></thead>
          <tbody>
            {criteria.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td><span className="kode-badge">{item.code}</span></td>
                <td><b>{item.name}</b></td>
                <td>
                  <input
                    className="bobot-input"
                    type="number"
                    step="1"
                    min="1"
                    max="5"
                    value={item.weight}
                    onChange={(e) => setCriteria((prev) => prev.map((row) => row.id === item.id ? { ...row, weight: Number(e.target.value) } : row))}
                  />
                </td>
                <td><b>{totalBobot ? (Number(item.weight) / totalBobot).toFixed(4).replace('.', ',') : '0,0000'}</b></td>
                <td>
                  <select
                    className="tipe-select"
                    value={item.type}
                    onChange={(e) => setCriteria((prev) => prev.map((row) => row.id === item.id ? { ...row, type: e.target.value as 'benefit' | 'cost' } : row))}
                  >
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                </td>
                <td>
                  <button className="btn light" onClick={() => updateWeight(item.id, Number(item.weight), item.type)}>Simpan</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}><b>Total Bobot</b></td>
              <td><b>{totalBobot.toFixed(0)}</b></td>
              <td><b>1,0000</b></td>
              <td colSpan={2}><Badge variant={totalBobot === 24 ? 'success' : 'warning'}>{totalBobot === 24 ? 'Valid' : 'Cek Bobot'}</Badge></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Layout>
  );
}
