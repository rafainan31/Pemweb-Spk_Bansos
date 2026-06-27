import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'bansos_topsis';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

async function main() {
  const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`schema.sql tidak ditemukan: ${schemaPath}`);
  }

  const schemaText = fs.readFileSync(schemaPath, 'utf8');
  const schema = schemaText
    .replace(/CREATE DATABASE IF NOT EXISTS `?bansos_topsis`?/gi, `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
    .replace(/USE `?bansos_topsis`?/gi, `USE \`${DB_NAME}\``);

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log(`Membuat database ${DB_NAME} jika belum ada...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${DB_NAME}\`;`);
    console.log(`Mengimpor schema dari ${schemaPath}`);
    await connection.query(schema);
    console.log('Inisialisasi database selesai.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Gagal inisialisasi database:');
  console.error(error);
  process.exit(1);
});
