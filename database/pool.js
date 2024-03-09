const { Pool } = require("pg");

const dbPORT = process.env.DB_PORT || 5432;

// Konfigurasi koneksi ke database PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: dbPORT,
});

module.exports = pool;
