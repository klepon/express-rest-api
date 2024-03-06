const pool = require("../database/pool.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    puid UUID DEFAULT uuid_generate_v4() UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_validation INTEGER NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    role VARCHAR(11) NOT NULL,
    avatar_id INTEGER,
    bio VARCHAR(255),
    address VARCHAR(255),
    latlng VARCHAR(30)
  )
`;

// const createIndexQuery = `
//   CREATE INDEX IF NOT EXISTS idx_users_puid ON users (puid);
//   CREATE INDEX IF NOT EXISTS idx_users_id ON users (id);
// `;

createTable = async () => {
  // const createTable = async () => {
  try {
    // await pool.query(`DROP TABLE IF EXISTS users;`); // coment ini setelah table diupdate
    await pool.query(createTableQuery);
    // ini tidak perlu karena otomatis buat btree index untuk field yg unik
    // await pool.query(createIndexQuery);
    console.log("User table created successfully");
  } catch (error) {
    console.error("Error creating user table:", error);
  }
};

module.exports = { createTable };
