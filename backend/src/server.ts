import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool, testConnection } from "./db";
import { Criteria } from "./types";
import { calculateTOPSIS } from "./topsis";
import { calculateSAW } from "./saw";
import { calculateWP } from "./wp";

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
  userId?: number; 
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
  scores: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

const FIELD_MAP: Record<keyof Omit<PenilaianInput, "nama" | "nik" | "alamat" | "userId">, string> = {
  pendapatanBulanan: "C1",
  dayaListrik: "C2",
  jenisDinding: "C3",
  jenisLantai: "C4",
  kepemilikanKendaraan: "C5",
  komponenPkh: "C6",
};

const CODE_TO_FIELD: Record<string, keyof Omit<PenilaianInput, "nama" | "nik" | "alamat" | "userId">> = {
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
  const required: (keyof Omit<PenilaianInput, "userId">)[] = [
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
  const [requestRows] = await pool.query("SELECT id FROM rekomendasi_request ORDER BY id ASC LIMIT 1");
  const requests = requestRows as { id: number }[];

  if (requests.length > 0) {
    return requests[0].id;
  }

  const [wargaRows] = await pool.query("SELECT id FROM warga ORDER BY id ASC LIMIT 1");
  const wargaList = wargaRows as { id: number }[];

  if (wargaList.length === 0) {
    throw new Error("Gagal menginisialisasi request default karena tabel 'warga' masih kosong murni di database.");
  }

  const defaultWargaId = wargaList[0].id;

  const [result] = await pool.query(
    `INSERT INTO rekomendasi_request (warga_id, status) VALUES (?, 'Proses')`, 
    [defaultWargaId]
  );

  return (result as { insertId: number }).insertId;
}

async function getCriteria(): Promise<Criteria[]> {
  const [rows] = await pool.query(
    `SELECT id, kode AS code, nama AS name, type, weight FROM kriteria ORDER BY CAST(SUBSTRING(kode, 2) AS UNSIGNED) ASC`
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
    `SELECT k.kode, kv.value_label, kv.skor FROM kriteria_value kv JOIN kriteria k ON k.id = kv.kriteria_id ORDER BY CAST(SUBSTRING(k.kode, 2) AS UNSIGNED) ASC, kv.skor ASC`
  );
  const options: Record<string, { label: string; value: number; score: number }[]> = {};
  for (const row of rows as any[]) {
    const field = CODE_TO_FIELD[row.kode];
    if (!field) continue;
    if (!options[field]) options[field] = [];
    options[field].push({ label: row.value_label, value: Number(row.skor), score: Number(row.skor) });
  }
  return options;
}

async function getWargaList(): Promise<WargaItem[]> {
  let rows: any[] = [];
  try {
    const [result] = await pool.query(
      `SELECT w.id, w.nik, w.nama, w.alamat, w.created_at, w.updated_at, k.kode, kv.value_label, pw.skor
       FROM warga w
       LEFT JOIN penilaian_warga pw ON pw.warga_id = w.id
       LEFT JOIN kriteria k ON k.id = pw.kriteria_id
       LEFT JOIN kriteria_value kv ON kv.id = pw.kriteria_value_id
       ORDER BY w.id DESC, CAST(SUBSTRING(k.kode, 2) AS UNSIGNED) ASC`
    );
    rows = result as any[];
  } catch (err) {
    console.error("SQL ERROR getWargaList query:", err);
    return [];
  }

  const map = new Map<number, any>();
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
        scores: { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0 },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        nilai_saw: 0,
        nilai_wp: 0,
        nilai_topsis: 0,
      });
    }

    const warga = map.get(row.id);
    if (!warga) continue;
    if (row.kode) {
      const field = CODE_TO_FIELD[row.kode];
      if (field) warga[field] = row.value_label || "";
      warga.scores[row.kode] = Number(row.skor || 0);
    }
  }

  try {
    for (const [id, wargaObj] of map.entries()) {
      const [resRows] = await pool.query(
        "SELECT nilai_saw, nilai_wp, nilai_topsis FROM rekomendasi_result WHERE warga_id = ? LIMIT 1",
        [id]
      );
      const match = (resRows as any[])[0];
      if (match) {
        wargaObj.nilai_saw = Number(match.nilai_saw) || 0;
        wargaObj.nilai_wp = Number(match.nilai_wp) || 0;
        wargaObj.nilai_topsis = Number(match.nilai_topsis) || 0;
      }
    }
  } catch (e) {
    console.warn("Gagal mengambil data rekomendasi_result:", (e as any).message);
  }

  return Array.from(map.values()).map((item) => {
    const totalScores = Object.keys(item.scores).filter((key) => Number(item.scores[key]) > 0).length;
    return { ...item, status: totalScores >= 6 ? "Sudah Dinilai" : "Belum Dinilai" };
  });
}

async function saveTerpaduMultiMetode(topsisResults: any[], sawResults: any[], wpResults: any[]) {
  const requestId = await ensureDefaultRequest();
  for (const item of topsisResults) {
    const sawMatch = sawResults.find((s) => s.id === item.id);
    const wpMatch = wpResults.find((w) => w.id === item.id);
    const nilaiSaw = sawMatch ? (sawMatch.nilaiSAW || 0) : 0;
    const nilaiWp = wpMatch ? (wpMatch.nilaiWP || 0) : 0;
    const nilaiTopsis = item.preference || 0;
    const ranking = item.rank || 0;

    await pool.query(
      `INSERT INTO rekomendasi_result (rekomendasi_request_id, warga_id, nilai_saw, nilai_wp, nilai_topsis, ranking)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nilai_saw = VALUES(nilai_saw), nilai_wp = VALUES(nilai_wp), nilai_topsis = VALUES(nilai_topsis), ranking = VALUES(ranking)`,
      [requestId, item.id, nilaiSaw, nilaiWp, nilaiTopsis, ranking]
    );
  }
}

app.get("/api/criteria", async (_req, res) => {
  try {
    const rows = await getCriteria();
    res.json(rows.map(item => ({ ...item, weight: Number(item.weight || 0) })));
  } catch (error) {
    console.error("ERROR GET CRITERIA:", error);
    res.status(500).json({ message: "Gagal ambil kriteria" });
  }
});

app.put("/api/criteria/:id", async (req, res) => {
  try {
    const { weight, type } = req.body;
    const { id } = req.params;

    if (weight === undefined || !type) {
      res.status(400).json({ message: "weight dan type wajib diisi" });
      return;
    }

    const requestId = await ensureDefaultRequest();
    await pool.query("UPDATE kriteria SET weight = ?, type = ? WHERE id = ?", [Number(weight), type, id]);
    await pool.query(
      `INSERT INTO rekomendasi_req_weight (rekomendasi_request_id, kriteria_id, bobot)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE bobot = VALUES(bobot)`,
      [requestId, id, Number(weight)]
    );

    const rows = await getCriteria();
    res.json({ message: "Kriteria berhasil diperbarui", data: rows });
  } catch (error) {
    res.status(500).json({ message: "Gagal", error: String(error) });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username dan password wajib diisi" });
      return;
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    const user = (rows as any[])[0];

    if (!user || user.password !== password) {
      res.status(401).json({ message: "Username atau password salah!" });
      return;
    }

    res.json({
      message: "Login Berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan sistem pada server" });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await testConnection();
    res.json({ message: "Backend berjalan" });
  } catch (error) { res.status(500).json({ message: "Gagal" }); }
});

app.get("/api/options", async (_req, res) => {
  try {
    const options = await getOptionsFromDatabase();
    res.json(options);
  } catch (error) { res.status(500).json({ message: "Gagal" }); }
});

app.get("/api/warga", async (_req, res) => {
  try {
    const criteria = await getCriteria();
    const warga = await getWargaList();
    if (!warga || warga.length === 0) { res.json([]); return; }

    const wargaDTO = warga.map((w: any) => {
      const baseScores = w.scores || {};
      return {
        ...w,
        scores: {
          C1: Number(baseScores.C1 || 0), C2: Number(baseScores.C2 || 0),
          C3: Number(baseScores.C3 || 0), C4: Number(baseScores.C4 || 0),
          C5: Number(baseScores.C5 || 0), C6: Number(baseScores.C6 || 0),
        }
      };
    });

    const topsis = calculateTOPSIS(wargaDTO, criteria);
    const saw = calculateSAW(wargaDTO, criteria);
    const wp = calculateWP(wargaDTO, criteria);

    try {
      if (topsis?.results?.length > 0) await saveTerpaduMultiMetode(topsis.results, saw, wp);
    } catch (e) { console.warn(e); }

    const finalData = warga.map((w) => {
      const tMatch = topsis.results.find((t: any) => t.id === w.id);
      const sMatch = saw.find((s: any) => s.id === w.id);
      const wMatch = wp.find((wM: any) => wM.id === w.id);
      return {
        ...w,
        nilai_topsis: tMatch ? Number(tMatch.preference || 0) : 0,
        nilai_saw: sMatch ? Number(sMatch.nilaiSAW || 0) : 0,
        nilai_wp: wMatch ? Number(wMatch.nilaiWP || 0) : 0,
      };
    });

    res.json(finalData);
  } catch (error) { res.status(500).json({ message: "Gagal" }); }
});

app.get("/api/topsis", async (_req, res) => {
  try {
    const [criteria, warga] = await Promise.all([getCriteria(), getWargaList()]);
    const wargaDTO = warga.map((w: any) => {
      const baseScores = w.scores || {};
      return {
        ...w,
        scores: {
          C1: Number(baseScores.C1 || 0), C2: Number(baseScores.C2 || 0),
          C3: Number(baseScores.C3 || 0), C4: Number(baseScores.C4 || 0),
          C5: Number(baseScores.C5 || 0), C6: Number(baseScores.C6 || 0),
        }
      };
    });

    const topsis = calculateTOPSIS(wargaDTO, criteria);
    const saw = calculateSAW(wargaDTO, criteria);
    const wp = calculateWP(wargaDTO, criteria);

    try { await saveTerpaduMultiMetode(topsis.results, saw, wp); } catch (e) {}

    const mergedResults = topsis.results.map((tItem: any) => {
      const sMatch = saw.find((s: any) => s.id === tItem.id);
      const wMatch = wp.find((w: any) => w.id === tItem.id);
      return {
        id: tItem.id, code: tItem.code, nama: tItem.nama, nik: tItem.nik,
        dPlus: tItem.dPlus, dMinus: tItem.dMinus,
        nilai_saw: sMatch ? (sMatch.nilaiSAW || 0) : 0,
        nilai_wp: wMatch ? (wMatch.nilaiWP || 0) : 0,
        nilai_topsis: tItem.preference || 0,
        ranking: tItem.rank
      };
    });

    res.json({
      criteria: criteria.map((c: any) => ({ ...c, weight: Number(c.weight || 0) })),
      results: mergedResults,
      normalizedWeights: topsis.normalizedWeights || {},
      idealPositive: topsis.idealPositive || {},
      idealNegative: topsis.idealNegative || {},
      weightSum: criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0)
    });
  } catch (error) { res.status(500).json({ message: "Gagal" }); }
});

app.get("/api/summary", async (_req, res) => {
  let totalWarga = 0, sudahDinilai = 0, prioritas: any[] = [];
  try {
    const [wRows] = await pool.query("SELECT COUNT(*) as total FROM warga");
    totalWarga = (wRows as any)[0].total || 0;
    const [pRows] = await pool.query("SELECT COUNT(DISTINCT warga_id) as total FROM penilaian_warga");
    sudahDinilai = (pRows as any)[0].total || 0;

    const [criteria, warga] = await Promise.all([getCriteria(), getWargaList()]);
    if (warga.length > 0) {
      if (sudahDinilai > 0) {
        const topsis = calculateTOPSIS(warga, criteria);
        const saw = calculateSAW(warga, criteria);
        const wp = calculateWP(warga, criteria);
        const rawPrioritas = topsis.results.map((tItem: any) => {
          const sMatch = saw.find((s: any) => s.id === tItem.id);
          const wMatch = wp.find((w) => w.id === tItem.id);
          return {
            id: tItem.id, code: tItem.code, nama: tItem.nama,
            nilai_saw: sMatch ? (sMatch.nilaiSAW || 0) : 0,
            nilai_wp: wMatch ? (wMatch.nilaiWP || 0) : 0,
            nilai_topsis: tItem.preference || 0,
            ranking: 999
          };
        });
        prioritas = rawPrioritas.sort((a: any, b: any) => b.nilai_topsis - a.nilai_topsis).map((item, index) => ({ ...item, ranking: index + 1 }));
      } else {
        prioritas = warga.map((w: any, index: number) => ({
          id: w.id, code: `A${w.id}`, nama: w.nama, nilai_saw: 0, nilai_wp: 0, nilai_topsis: 0, ranking: index + 1
        }));
      }
      prioritas = prioritas.slice(0, 5);
    }
  } catch (err) { console.error(err); }
  res.json({ totalWarga, sudahDinilai, prioritas });
});

app.delete("/api/warga/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM warga WHERE id = ?", [req.params.id]);
    res.json({ message: "Data warga berhasil dihapus" });
  } catch (error) { res.status(500).json({ message: "Gagal" }); }
});

// =========================================================
// ROUTE SIMPAN DATA WARGA & SINKRONISASI KOLOM user_id MURNI
// =========================================================
app.post("/api/warga", async (req, res) => {
  const body = req.body as PenilaianInput;
  
  const validationError = validatePenilaianInput(body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  // VALIDASI KONSOL: Biar kelihatan di terminal backend ID mana yang masuk
  console.log("-> REQUEST INPUT DITERIMA DARI PETUGAS ID:", body.userId);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const cleanNik = String(body.nik).replace(/\s/g, "");
    
    const [existingRows] = await connection.query("SELECT id FROM warga WHERE nik = ? LIMIT 1", [cleanNik]);
    const existing = (existingRows as { id: number }[])[0];

    let wargaId = existing ? existing.id : 0;
    if (existing) {
      await connection.query("UPDATE warga SET nama = ?, alamat = ? WHERE id = ?", [body.nama, body.alamat || "-", wargaId]);
    } else {
      const [insertResult] = await connection.query("INSERT INTO warga (nik, nama, alamat) VALUES (?, ?, ?)", [cleanNik, body.nama, body.alamat || "-"]);
      wargaId = (insertResult as { insertId: number }).insertId;
    }

    const petugasId = body.userId || null;

    for (const [field, code] of Object.entries(FIELD_MAP)) {
      const selectedLabel = body[field as keyof typeof FIELD_MAP];
      
      const [valueRows] = await connection.query(
        `SELECT k.id AS kriteria_id, kv.id AS kriteria_value_id, kv.skor
         FROM kriteria k 
         JOIN kriteria_value kv ON kv.kriteria_id = k.id
         WHERE k.kode = ? AND kv.value_label = ? LIMIT 1`, [code, selectedLabel]
      );
      
      const selected = (valueRows as any[])[0];
      if (selected) {
        // PERBAIKAN TOTAL: Memaksa UPDATE user_id = VALUES(user_id) secara independen tanpa memedulikan status skor duplikat
        await connection.query(
          `INSERT INTO penilaian_warga (warga_id, kriteria_id, kriteria_value_id, user_id, skor) 
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             kriteria_value_id = VALUES(kriteria_value_id), 
             skor = VALUES(skor),
             user_id = ${petugasId ? Number(petugasId) : 'NULL'}`, 
          [wargaId, selected.kriteria_id, selected.kriteria_value_id, petugasId, selected.skor]
        );
      }
    }

    await connection.commit();
    res.json({ message: "Data warga berhasil disimpan", id: wargaId, code: `A${wargaId}` });
  } catch (error) {
    await connection.rollback();
    console.error("ERROR SAVE WARGA:", error);
    res.status(500).json({ message: "Gagal menyimpan ke database" });
  } finally {
    connection.release();
  }
});

app.post("/api/warga/save", async (req, res) => {
  res.redirect(307, "/api/warga");
});

app.listen(PORT, () => {
  console.log(`Backend berjalan di http://localhost:${PORT}`);
});