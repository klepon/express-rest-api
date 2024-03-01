const { Pool } = require("pg");
require("dotenv").config();

const dbPORT = process.env.DB_PORT || 5432;

// Konfigurasi koneksi ke database PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "template1",
  password: "",
  port: dbPORT,
});

module.exports = pool;
