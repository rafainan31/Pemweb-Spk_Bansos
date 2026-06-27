import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool, testConnection } from "./db";
import { calculateTOPSIS } from "./topsis";
import { Criteria } from "./types";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

interface PenilaianInput {
  nama: string;
  nik: string;
  alamat?: string;
  pendapatanBulanan: string;
  dayaListrik: string;
  jenisDinding: string;
  jenisLantai: string;
  kepemilikanKendaraan: string;
  komponenPkh: string;
}

interface WargaItem {
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
  statusKelayakan: string;
  scores: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

const FIELD_MAP: Record<
  keyof Omit<PenilaianInput, "nama" | "nik" | "alamat">,
  string
> = {
  pendapatanBulanan: "C1",
  dayaListrik: "C2",
  jenisDinding: "C3",
  jenisLantai: "C4",
  kepemilikanKendaraan: "C5",
  komponenPkh: "C6",
};

const CODE_TO_FIELD: Record<
  string,
  keyof Omit<PenilaianInput, "nama" | "nik" | "alamat">
> = {
  C1: "pendapatanBulanan",
  C2: "dayaListrik",
  C3: "jenisDinding",
  C4: "jenisLantai",
  C5: "kepemilikanKendaraan",
  C6: "komponenPkh",
};

const DEFAULT_WEIGHT: Record<string, number> = {
  C1: 5,
  C2: 4,
  C3: 4,
  C4: 4,
  C5: 4,
  C6: 4,
};

function validatePenilaianInput(body: Partial<PenilaianInput>) {
  const required: (keyof PenilaianInput)[] = [
    "nama",
    "nik",
    "pendapatanBulanan",
    "dayaListrik",
    "jenisDinding",
    "jenisLantai",
    "kepemilikanKendaraan",
    "komponenPkh",
  ];

  for (const field of required) {
    if (!body[field]) {
      return `${field} wajib diisi`;
    }
  }

  if (body.nik && !/^\d{10,20}$/.test(String(body.nik).replace(/\s/g, ""))) {
    return "NIK harus berupa angka dengan panjang 10 sampai 20 digit";
  }

  return null;
}

async function ensureDefaultRequest() {
  const [requestRows] = await pool.query(
    "SELECT id FROM rekomendasi_request ORDER BY id ASC LIMIT 1"
  );

  const requests = requestRows as { id: number }[];

  if (requests.length > 0) {
    return requests[0].id;
  }

  const [result] = await pool.query(
    `INSERT INTO rekomendasi_request (admin_id, nama_request, deskripsi)
     VALUES (NULL, 'Seleksi Bansos Default', 'Perhitungan TOPSIS default berdasarkan 6 kriteria utama.')`
  );

  return (result as { insertId: number }).insertId;
}

async function ensureDefaultWeights(requestId: number) {
  const [criteriaRows] = await pool.query(
    `SELECT id, kode 
     FROM kriteria 
     ORDER BY CAST(SUBSTRING(kode, 2) AS UNSIGNED) ASC`
  );

  const rows = criteriaRows as { id: number; kode: string }[];

  for (const item of rows) {
    const bobot = DEFAULT_WEIGHT[item.kode] || 1;

    await pool.query(
      `INSERT INTO rekomendasi_req_weight 
        (rekomendasi_request_id, kriteria_id, bobot)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE bobot = VALUES(bobot)`,
      [requestId, item.id, bobot]
    );
  }
}

async function getCriteria(): Promise<Criteria[]> {
  const requestId = await ensureDefaultRequest();
  await ensureDefaultWeights(requestId);

  const [rows] = await pool.query(
    `SELECT 
        k.id,
        k.kode AS code,
        k.nama AS name,
        k.type,
        COALESCE(rw.bobot, 1) AS weight
     FROM kriteria k
     LEFT JOIN rekomendasi_req_weight rw 
        ON rw.kriteria_id = k.id
       AND rw.rekomendasi_request_id = ?
     ORDER BY CAST(SUBSTRING(k.kode, 2) AS UNSIGNED) ASC`,
    [requestId]
  );

  return (rows as any[]).map((item) => ({
    id: Number(item.id),
    code: item.code,
    name: item.name,
    type: item.type,
    weight: Number(item.weight),
  }));
}

async function getOptionsFromDatabase() {
  const [rows] = await pool.query(
    `SELECT 
        k.kode,
        kv.value_label,
        kv.skor
     FROM kriteria_value kv
     JOIN kriteria k ON k.id = kv.kriteria_id
     ORDER BY CAST(SUBSTRING(k.kode, 2) AS UNSIGNED) ASC, kv.skor ASC`
  );

  const options: Record<
    string,
    { label: string; value: number; score: number }[]
  > = {};

  for (const row of rows as any[]) {
    const field = CODE_TO_FIELD[row.kode];

    if (!field) continue;

    if (!options[field]) {
      options[field] = [];
    }

    options[field].push({
      label: row.value_label,
      value: Number(row.skor),
      score: Number(row.skor),
    });
  }

  return options;
}

async function getWargaList(): Promise<WargaItem[]> {
  const [rows] = await pool.query(
    `SELECT
        w.id,
        w.nik,
        w.nama,
        w.alamat,
        w.status_kelayakan,
        w.created_at,
        w.updated_at,
        k.kode,
        kv.value_label,
        pw.skor
     FROM warga w
     LEFT JOIN penilaian_warga pw ON pw.warga_id = w.id
     LEFT JOIN kriteria k ON k.id = pw.kriteria_id
     LEFT JOIN kriteria_value kv ON kv.id = pw.kriteria_value_id
     ORDER BY w.id DESC, CAST(SUBSTRING(k.kode, 2) AS UNSIGNED) ASC`
  );

  const map = new Map<number, WargaItem>();

  for (const row of rows as any[]) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: Number(row.id),
        code: `A${row.id}`,
        nama: row.nama,
        nik: row.nik,
        alamat: row.alamat || "-",

        pendapatanBulanan: "",
        dayaListrik: "",
        jenisDinding: "",
        jenisLantai: "",
        kepemilikanKendaraan: "",
        komponenPkh: "",

        status: "Belum Dinilai",
        statusKelayakan: row.status_kelayakan || "Belum Dinilai",

        scores: {},

        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    const warga = map.get(row.id);

    if (!warga) continue;

    if (row.kode) {
      const field = CODE_TO_FIELD[row.kode];

      if (field) {
        warga[field] = row.value_label || "";
      }

      warga.scores[row.kode] = Number(row.skor || 0);
    }
  }

  return Array.from(map.values()).map((item) => {
    const totalScores = Object.values(item.scores).filter(
      (score) => Number(score) > 0
    ).length;

    return {
      ...item,
      status: totalScores >= 6 ? "Sudah Dinilai" : "Belum Dinilai",
    };
  });
}

async function saveTopsisResult(topsis: any) {
  const requestId = await ensureDefaultRequest();

  await pool.query(
    "DELETE FROM rekomendasi_result WHERE rekomendasi_request_id = ?",
    [requestId]
  );

  for (const item of topsis.results) {
    await pool.query(
      `INSERT INTO rekomendasi_result
        (rekomendasi_request_id, warga_id, skor, ranking, status_kelayakan, d_plus, d_minus)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        requestId,
        item.id,
        item.preference,
        item.rank,
        item.status,
        item.dPlus,
        item.dMinus,
      ]
    );

    await pool.query("UPDATE warga SET status_kelayakan = ? WHERE id = ?", [
      item.status,
      item.id,
    ]);
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    await testConnection();

    res.json({
      message: "Backend berjalan dan MariaDB terhubung",
    });
  } catch (error) {
    res.status(500).json({
      message: "Backend berjalan, tetapi MariaDB belum terhubung",
      error: String(error),
    });
  }
});

app.get("/api/options", async (_req, res) => {
  try {
    const options = await getOptionsFromDatabase();

    res.json(options);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil opsi kriteria",
      error: String(error),
    });
  }
});

app.get("/api/criteria", async (_req, res) => {
  try {
    const rows = await getCriteria();

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kriteria",
      error: String(error),
    });
  }
});

app.put("/api/criteria/:id", async (req, res) => {
  try {
    const { weight, type } = req.body;

    if (weight === undefined || !type) {
      res.status(400).json({
        message: "weight dan type wajib diisi",
      });
      return;
    }

    if (!["benefit", "cost"].includes(type)) {
      res.status(400).json({
        message: "type harus benefit atau cost",
      });
      return;
    }

    const requestId = await ensureDefaultRequest();

    await pool.query("UPDATE kriteria SET type = ? WHERE id = ?", [
      type,
      req.params.id,
    ]);

    await pool.query(
      `INSERT INTO rekomendasi_req_weight 
        (rekomendasi_request_id, kriteria_id, bobot)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE bobot = VALUES(bobot)`,
      [requestId, req.params.id, Number(weight)]
    );

    const rows = await getCriteria();

    res.json({
      message: "Kriteria berhasil diperbarui",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui kriteria",
      error: String(error),
    });
  }
});

app.get("/api/warga", async (_req, res) => {
  try {
    const data = await getWargaList();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data warga",
      error: String(error),
    });
  }
});

app.get("/api/warga/nik/:nik", async (req, res) => {
  try {
    const cleanNik = String(req.params.nik).replace(/\s/g, "");
    const data = await getWargaList();
    const found = data.find((item) => item.nik === cleanNik);

    if (!found) {
      res.status(404).json({
        message: "Data warga tidak ditemukan",
      });
      return;
    }

    const requestId = await ensureDefaultRequest();

    const [resultRows] = await pool.query(
      `SELECT 
          rr.skor AS preference,
          rr.ranking AS rank,
          rr.status_kelayakan AS status,
          rr.d_plus AS dPlus,
          rr.d_minus AS dMinus
       FROM rekomendasi_result rr
       WHERE rr.rekomendasi_request_id = ? 
         AND rr.warga_id = ?
       LIMIT 1`,
      [requestId, found.id]
    );

    const ranking = (resultRows as any[])[0] || null;

    res.json({
      ...found,
      ranking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengecek data warga",
      error: String(error),
    });
  }
});

app.post("/api/cek-data", async (req, res) => {
  try {
    const { nama, nik } = req.body;

    if (!nama || !nik) {
      res.status(400).json({
        message: "Nama dan NIK wajib diisi",
      });
      return;
    }

    const cleanNama = String(nama).trim().toLowerCase();
    const cleanNik = String(nik).replace(/\s/g, "");

    const warga = await getWargaList();

    const found = warga.find((item) => {
      return (
        item.nik === cleanNik &&
        item.nama.trim().toLowerCase() === cleanNama
      );
    });

    if (!found) {
      res.status(404).json({
        message:
          "Data tidak ditemukan. Pastikan nama dan NIK sesuai dengan data yang terdaftar.",
      });
      return;
    }

    const criteria = await getCriteria();

    const wargaDTO = warga.map((w: any) => ({
      ...w,
      createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
    }));

    const topsis = calculateTOPSIS(wargaDTO, criteria);

    await saveTopsisResult(topsis);

    const ranking =
      topsis.results.find((item: any) => item.id === found.id) || null;

    res.json({
      id: found.id,
      code: found.code,
      nama: found.nama,
      nik: found.nik,
      status: ranking?.status || found.statusKelayakan || "Belum Dihitung",
      ranking: ranking
        ? {
            preference: ranking.preference,
            rank: ranking.rank,
            status: ranking.status,
            dPlus: ranking.dPlus,
            dMinus: ranking.dMinus,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengecek data",
      error: String(error),
    });
  }
});

app.post("/api/warga", async (req, res) => {
  const body = req.body as PenilaianInput;

  const validationMessage = validatePenilaianInput(body);

  if (validationMessage) {
    res.status(400).json({
      message: validationMessage,
    });
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cleanNik = String(body.nik).replace(/\s/g, "");

    const [existingRows] = await connection.query(
      "SELECT id FROM warga WHERE nik = ? LIMIT 1",
      [cleanNik]
    );

    const existing = (existingRows as { id: number }[])[0];

    let wargaId: number;

    if (existing) {
      wargaId = existing.id;

      await connection.query(
        `UPDATE warga 
         SET nama = ?, alamat = ?, status_kelayakan = 'Belum Dihitung'
         WHERE id = ?`,
        [body.nama, body.alamat || "-", wargaId]
      );
    } else {
      const [insertResult] = await connection.query(
        `INSERT INTO warga (nik, nama, alamat, status_kelayakan)
         VALUES (?, ?, ?, 'Belum Dihitung')`,
        [cleanNik, body.nama, body.alamat || "-"]
      );

      wargaId = (insertResult as { insertId: number }).insertId;
    }

    for (const [field, code] of Object.entries(FIELD_MAP)) {
      const selectedLabel = body[field as keyof typeof FIELD_MAP];

      const [valueRows] = await connection.query(
        `SELECT 
            k.id AS kriteria_id,
            kv.id AS kriteria_value_id,
            kv.skor
         FROM kriteria k
         JOIN kriteria_value kv ON kv.kriteria_id = k.id
         WHERE k.kode = ? 
           AND kv.value_label = ?
         LIMIT 1`,
        [code, selectedLabel]
      );

      const selected = (valueRows as any[])[0];

      if (!selected) {
        throw new Error(`Pilihan ${field} tidak valid: ${selectedLabel}`);
      }

      await connection.query(
        `INSERT INTO penilaian_warga
          (warga_id, kriteria_id, kriteria_value_id, skor)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          kriteria_value_id = VALUES(kriteria_value_id),
          skor = VALUES(skor),
          updated_at = CURRENT_TIMESTAMP`,
        [
          wargaId,
          selected.kriteria_id,
          selected.kriteria_value_id,
          selected.skor,
        ]
      );
    }

    await connection.commit();

    res.status(existing ? 200 : 201).json({
      message: existing
        ? "Data warga berhasil diperbarui"
        : "Data warga berhasil disimpan",
      id: wargaId,
      code: `A${wargaId}`,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Gagal menyimpan data warga",
      error: String(error),
    });
  } finally {
    connection.release();
  }
});

app.delete("/api/warga/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM warga WHERE id = ?", [req.params.id]);

    res.json({
      message: "Data warga berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus data warga",
      error: String(error),
    });
  }
});

app.get("/api/topsis", async (_req, res) => {
  try {
    const [criteria, warga] = await Promise.all([
      getCriteria(),
      getWargaList(),
    ]);

    const wargaDTO = warga.map((w: any) => ({
      ...w,
      createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
    }));

    const topsis = calculateTOPSIS(wargaDTO, criteria);

    await saveTopsisResult(topsis);

    res.json({
      criteria,
      ...topsis,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghitung TOPSIS",
      error: String(error),
    });
  }
});

app.get("/api/summary", async (_req, res) => {
  try {
    const [criteria, warga] = await Promise.all([
      getCriteria(),
      getWargaList(),
    ]);

    const wargaDTO = warga.map((w: any) => ({
      ...w,
      createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
    }));

    const topsis = calculateTOPSIS(wargaDTO, criteria);
    const results = topsis.results;

    const countByStatus = (status: string) =>
      results.filter((item: any) => item.status === status).length;

    res.json({
      totalWarga: warga.length,
      sudahDinilai: warga.filter((item) => item.status === "Sudah Dinilai")
        .length,
      sangatLayak: countByStatus("Sangat Layak"),
      layak: countByStatus("Layak"),
      dipertimbangkan: countByStatus("Dipertimbangkan"),
      tidakLayak: countByStatus("Tidak Layak"),
      prioritas: results.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil ringkasan dashboard",
      error: String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});