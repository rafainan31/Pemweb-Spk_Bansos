import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { Criteria } from "../types";

export default function KriteriaPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadData() {
    try {
      const response = await api.getCriteria();

      // Saringan Sakti: Memaksa data dari backend dibaca sebagai array murni
      if (response && (response as any).data) {
        setCriteria((response as any).data);
      } else if (Array.isArray(response)) {
        setCriteria(response);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil kriteria');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalBobot = criteria.reduce((sum, item) => sum + Number(item.weight), 0);

  // FUNGSI BARU: Menyimpan seluruh kriteria yang berubah secara kolektif
  async function handleSaveAll() {
    setMessage('');
    setIsSaving(true);
    try {
      // Menjalankan pembaruan ke API backend secara paralel untuk semua kriteria C1-C6
      await Promise.all(
        criteria.map((item) => {
          // Kita bikin format huruf besar (Benefit/Cost) buat jaga-jaga kalau DB butuh kapital
          const formattedType = item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase();

          // Panggil fungsi dengan 3 argumen sesuai api.ts
          return api.updateCriterion(item.id, item.weight, formattedType);
        })
      );

      setMessage('Semua konfigurasi bobot kriteria berhasil disimpan ke MariaDB.');
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menyimpan semua kriteria');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout
      title="Data Kriteria & Bobot Parameter"
      subtitle="Konfigurasi bobot kepentingan C1-C6 untuk metode TOPSIS kelayakan bansos."
      right={
        <div className="flex items-center gap-3">
          <button className="btn light" onClick={loadData} disabled={isSaving}>
            Refresh Kriteria
          </button>

          {/* TOMBOL BARU: Simpan Semua Sekaligus */}
          <button
            className="btn primary flex items-center gap-2 shadow-md"
            onClick={handleSaveAll}
            disabled={isSaving}
            style={{ backgroundColor: '#1d66f5', color: '#fff', fontWeight: 'bold' }}
          >
            {isSaving ? (
              <>
                <span className="animate-spin inline-block mr-1">⌛</span>
                Menyimpan...
              </>
            ) : (
              'Simpan Semua Perubahan'
            )}
          </button>
        </div>
      }
    >
      {message && (
        <div className={`info-box ${message.includes('Gagal') ? 'danger-box' : ''}`}>
          {message}
        </div>
      )}

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
          <thead>
            <tr>
              <th>No</th>
              <th>Kode</th>
              <th>Nama Parameter Kriteria</th>
              <th>Bobot Nilai</th>
              <th>Bobot Normal</th>
              <th>Jenis Aturan</th>
            </tr>
          </thead>
          <tbody>
            {criteria && Array.isArray(criteria) && criteria.map((item, index) => (
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
                    disabled={isSaving}
                    onChange={(e) => setCriteria((prev) => prev.map((row) => row.id === item.id ? { ...row, weight: Number(e.target.value) } : row))}
                  />
                </td>
                <td><b>{totalBobot ? (Number(item.weight) / totalBobot).toFixed(4).replace('.', ',') : '0,0000'}</b></td>
                <td>
                  <select
                    className="tipe-select"
                    value={item.type}
                    disabled={isSaving}
                    onChange={(e) => setCriteria((prev) => prev.map((row) => row.id === item.id ? { ...row, type: e.target.value as 'benefit' | 'cost' } : row))}
                  >
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}><b>Total Bobot</b></td>
              <td><b>{totalBobot.toFixed(0)}</b></td>
              <td><b>1,0000</b></td>
              <td><Badge variant={totalBobot === 25 ? 'success' : 'warning'}>{totalBobot === 25 ? 'Valid' : 'Cek Bobot'}</Badge></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Layout>
  );
}