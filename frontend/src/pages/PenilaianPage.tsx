import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { api, OptionItem, OptionsResponse } from "../services/api";
import { PenilaianPayload } from "../types";

type OptionKey =
  | "pendapatanBulanan"
  | "dayaListrik"
  | "jenisDinding"
  | "jenisLantai"
  | "kepemilikanKendaraan"
  | "komponenPkh";

const fields: OptionKey[] = [
  "pendapatanBulanan",
  "dayaListrik",
  "jenisDinding",
  "jenisLantai",
  "kepemilikanKendaraan",
  "komponenPkh",
];

const criteriaMeta: Record<
  OptionKey,
  {
    code: string;
    name: string;
    type: "cost" | "benefit";
    description: string;
  }
> = {
  pendapatanBulanan: {
    code: "C1",
    name: "Pendapatan Bulanan",
    type: "cost",
    description: "Semakin besar pendapatan, semakin tidak diprioritaskan.",
  },
  dayaListrik: {
    code: "C2",
    name: "Daya Listrik",
    type: "cost",
    description: "Semakin besar daya listrik, semakin tidak diprioritaskan.",
  },
  jenisDinding: {
    code: "C3",
    name: "Jenis Dinding",
    type: "benefit",
    description: "Semakin kurang layak kondisi dinding, semakin diprioritaskan.",
  },
  jenisLantai: {
    code: "C4",
    name: "Jenis Lantai",
    type: "benefit",
    description: "Semakin kurang layak kondisi lantai, semakin diprioritaskan.",
  },
  kepemilikanKendaraan: {
    code: "C5",
    name: "Kepemilikan Kendaraan",
    type: "cost",
    description: "Semakin tinggi kepemilikan kendaraan, semakin tidak diprioritaskan.",
  },
  komponenPkh: {
    code: "C6",
    name: "Komponen PKH",
    type: "benefit",
    description: "Semakin banyak komponen PKH, semakin diprioritaskan.",
  },
};

const emptyOptions: OptionsResponse = {
  pendapatanBulanan: [],
  dayaListrik: [],
  jenisDinding: [],
  jenisLantai: [],
  kepemilikanKendaraan: [],
  komponenPkh: [],
};

const initialForm: PenilaianPayload = {
  nama: "",
  nik: "",
  alamat: "",
  pendapatanBulanan: "",
  dayaListrik: "",
  jenisDinding: "",
  jenisLantai: "",
  kepemilikanKendaraan: "",
  komponenPkh: "",
};

export default function PenilaianPage() {
  const location = useLocation();

  const [form, setForm] = useState<PenilaianPayload>(initialForm);
  const [optionsData, setOptionsData] = useState<OptionsResponse>(emptyOptions);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  async function loadOptions() {
    try {
      setLoadingOptions(true);
      const data = await api.getOptions();

      // Membalikkan skor khusus untuk kriteria bermasalah bertipe COST
      // Supaya logikanya lurus: Nilai terkecil (misal pendapatan <= 500rb) mendapatkan SKOR 1
      const keysToReverse: OptionKey[] = ["pendapatanBulanan", "dayaListrik", "kepemilikanKendaraan"];
      
      keysToReverse.forEach((key) => {
        if (data[key] && Array.isArray(data[key])) {
          // Salin data opsi agar tidak merubah data asli directly
          const sortedOptions = [...data[key]];
          
          // Dapatkan daftar skor unik yang tersedia secara berurutan (misal [1, 2, 3, 4, 5])
          const availableScores = sortedOptions
            .map(item => Number(item.score ?? item.value ?? 0))
            .sort((a, b) => a - b);
            
          const maxIndex = availableScores.length - 1;

          // Balikkan skornya secara dinamis
          data[key] = sortedOptions.map(item => {
            const currentScore = Number(item.score ?? item.value ?? 0);
            const originalIndex = availableScores.indexOf(currentScore);
            
            // Jika skor lama adalah 5 (index 4), skor baru menjadi index (4 - 4) = index 0 yaitu 1
            const newScore = originalIndex !== -1 ? availableScores[maxIndex - originalIndex] : currentScore;

            return {
              ...item,
              score: newScore,
              value: newScore // antisipasi jika backend menggunakan property value
            };
          });
        }
      });

      setOptionsData({
        ...emptyOptions,
        ...data,
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil pilihan kriteria dari database."
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    const nik = new URLSearchParams(location.search).get("nik");
    if (!nik) return;

    api
      .getWarga()
      .then((data) => {
        const found = data.find((item) => item.nik === nik);
        if (!found) return;

        setForm({
          nama: found.nama || "",
          nik: found.nik || "",
          alamat: found.alamat || "",
          pendapatanBulanan: found.pendapatanBulanan || "",
          dayaListrik: found.dayaListrik || "",
          jenisDinding: found.jenisDinding || "",
          jenisLantai: found.jenisLantai || "",
          kepemilikanKendaraan: found.kepemilikanKendaraan || "",
          komponenPkh: found.komponenPkh || "",
        });
      })
      .catch(() => undefined);
  }, [location.search]);

  function updateField<K extends keyof PenilaianPayload>(
    field: K,
    value: PenilaianPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nama.trim() || !form.nik.trim()) {
      setMessage("Nama dan NIK wajib diisi.");
      return;
    }

    const notComplete = fields.some((key) => !form[key]);

    if (notComplete) {
      setMessage("Semua parameter C1 sampai C6 wajib dipilih.");
      return;
    }

    try {
      setSaving(true);

      // 1. Ambil session petugas aktif dari localStorage
      // KODE BARU (Lebih aman untuk mendeteksi berbagai kemungkinan nama key)
      let loggedInUserId: number | undefined = undefined;

      // Coba cek beberapa kemungkinan key localStorage yang sering dipakai kelompokmu
      const sessionRaw = localStorage.getItem("user_session") || localStorage.getItem("user") || localStorage.getItem("userData");

      if (sessionRaw) {
        try {
          const parsed = JSON.parse(sessionRaw);
          // Ekstrak ID berdasarkan struktur object data yang ada
          loggedInUserId = parsed.id || parsed.user?.id || parsed.userData?.id;
        } catch (e) {
          console.error("Gagal membaca session user:", e);
        }
      }

      // 2. Gabungkan data form dengan userId petugas pendukung keputusan
      const payloadToSend = {
        ...form,
        userId: loggedInUserId
      };

      // PERBAIKAN UTAMA: Sekarang menembak dengan objek gabungan utuh, bukan data form kosongan lagi!
      const result = await api.savePenilaian(payloadToSend);

      setMessage(`${result.message}. Kode alternatif: ${result.code}.`);
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal menyimpan penilaian."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title="Form Penilaian Warga"
      subtitle="Input identitas warga dan parameter C1-C6 sesuai kriteria TOPSIS kelayakan bansos."
      right={
        <Link to="/ranking" className="btn success">
          Lihat Ranking
        </Link>
      }
    >
      <form className="assessment-form" onSubmit={handleSubmit}>
        <div className="hero-panel compact">
          <div>
            <span className="eyebrow">Input Alternatif</span>
            <h2>Data warga akan otomatis menjadi alternatif TOPSIS.</h2>
            <p>
              Pilihan kriteria diambil langsung dari database, lalu dikonversi
              menjadi skor untuk proses perhitungan TOPSIS.
            </p>
          </div>
          <div className="hero-metric">
            <b>6</b>
            <span>Kriteria Aktif</span>
          </div>
        </div>

        <div className="card glass-card">
          <div className="card-head">
            <div>
              <h3>Identitas Warga</h3>
              <p className="muted-text">
                Kode alternatif akan dibuat otomatis, misalnya A1, A2, dan
                seterusnya.
              </p>
            </div>
          </div>

          <div className="form-grid two">
            <label>
              Nama Lengkap
              <input
                value={form.nama}
                onChange={(e) => updateField("nama", e.target.value)}
                placeholder="Nama Lengkap"
              />
            </label>

            <label>
              NIK
              <input
                value={form.nik}
                onChange={(e) => updateField("nik", e.target.value)}
                placeholder="Masukkan NIK"
              />
            </label>

            <label className="wide">
              Alamat
              <input
                value={form.alamat}
                onChange={(e) => updateField("alamat", e.target.value)}
                placeholder="Masukkan alamat lengkap"
              />
            </label>
          </div>
        </div>

        <div className="card glass-card">
          <div className="card-head">
            <div>
              <h3>Parameter Penilaian</h3>
              <p className="muted-text">
                Pilih kondisi warga. Setiap pilihan akan dikonversi menjadi skor
                1 sampai 5.
              </p>
            </div>
            <button type="button" className="btn light" onClick={loadOptions}>
              Refresh Opsi
            </button>
          </div>

          {loadingOptions ? (
            <div className="empty-state">Memuat pilihan kriteria...</div>
          ) : (
            <div className="criteria-form-grid">
              {fields.map((field) => (
                <SelectField
                  key={field}
                  field={field}
                  value={form[field]}
                  options={optionsData[field]}
                  onChange={updateField}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rule-grid">
          <div className="info-box no-margin">
            <b>Cost</b>
            <br />
            Semakin besar skor, semakin tidak diprioritaskan. Digunakan untuk
            pendapatan, daya listrik, dan kendaraan.
          </div>
          <div className="info-box no-margin success-box">
            <b>Benefit</b>
            <br />
            Semakin besar skor, semakin diprioritaskan. Digunakan untuk kondisi
            rumah dan komponen PKH.
          </div>
        </div>

        {message && <div className="info-box">{message}</div>}

        <div className="form-actions sticky-actions">
          <button type="button" className="btn outline" onClick={resetForm}>
            Reset
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Penilaian"}
          </button>
          {/* UBAH HURUF DEPANNYA MENJADI KAPITAL 'Link' */}
          <Link to="/perhitungan" className="btn success">
            Proses TOPSIS
          </Link>
        </div>
      </form>
    </Layout>
  );
}

interface SelectFieldProps {
  field: OptionKey;
  value: string;
  options: OptionItem[];
  onChange: (field: OptionKey, value: string) => void;
}

function SelectField({ field, value, options, onChange }: SelectFieldProps) {
  const meta = criteriaMeta[field];
  const selected = options.find((item) => item.label === value);

  return (
    <label className="criteria-select-card">
      <div className="criteria-select-head">
        <span className="kode-badge">{meta.code}</span>
        <span className={`badge ${meta.type === "benefit" ? "success" : "warning"}`}>
          {meta.type.toUpperCase()}
        </span>
      </div>

      <span className="criteria-label">{meta.name}</span>
      <small>{meta.description}</small>

      <select value={value} onChange={(e) => onChange(field, e.target.value)}>
        <option value="">Pilih {meta.name.toLowerCase()}</option>
        {options.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label} — Skor {item.score ?? item.value}
          </option>
        ))}
      </select>

      {selected && (
        <span className="score-preview">
          Skor tersimpan: <b>{selected.score ?? selected.value}</b>
        </span>
      )}
    </label>
  );
}