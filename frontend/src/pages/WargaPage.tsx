import { useEffect, useMemo, useState } from "react";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { Warga } from "../types";

export default function WargaPage() {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const data = await api.getWarga();
      setWarga(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal mengambil data warga');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return warga.filter((item) =>
      item.nama.toLowerCase().includes(keyword) || item.nik.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword)
    );
  }, [warga, search]);

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm('Yakin ingin menghapus data warga ini?');
    if (!confirmDelete) return;

    try {
      await api.deleteWarga(id);
      setMessage('Data warga berhasil dihapus.');
      loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menghapus data warga');
    }
  }

  return (
    <Layout title="Data Warga / Alternatif" subtitle="Kelola calon penerima yang sudah dinilai berdasarkan kriteria C1-C6." right={<a href="/penilaian" className="btn primary">+ Tambah Warga</a>}>
      <div className="toolbar floating-toolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, NIK, atau kode alternatif..." />
        <button className="btn outline" onClick={loadData}>Refresh</button>
      </div>

      {message && <div className="info-box">{message}</div>}

      <div className="card table-card premium-table">
        <table>
          <thead>
            <tr><th>Kode</th><th>Nama</th><th>NIK</th><th>Alamat</th><th>Pendapatan</th><th>Listrik</th><th>Kendaraan</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>Belum ada data warga. Tambahkan dari halaman Penilaian.</td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id}>
                <td><span className="kode-badge">{item.code}</span></td>
                <td><b>{item.nama}</b></td>
                <td>{item.nik}</td>
                <td>{item.alamat}</td>
                <td>{item.pendapatanBulanan}</td>
                <td>{item.dayaListrik}</td>
                <td>{item.kepemilikanKendaraan}</td>
                <td><Badge>{item.status}</Badge></td>
                <td>
                  <div className="action-buttons">
                    <a href={`/penilaian?nik=${item.nik}`} title="Edit">✎</a>
                    <button type="button" onClick={() => handleDelete(item.id)} title="Hapus">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">Menampilkan {filtered.length} dari {warga.length} data</div>
      </div>
    </Layout>
  );
}
