const bcrypt = require("bcrypt");
const pool = require("../database/pool.js");
const { Role } = require("./constant.js");
require("dotenv").config();

exports.tableName = "users";

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${exports.tableName} (
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

exports.createTableUser = async () => {
  try {
    // coment ini setelah table diupdate
    // await pool.query(`DROP TABLE IF EXISTS ${exports.tableName};`);

    pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '" +
        exports.tableName +
        "');",
      async (_err, res) => {
        if (!res.rows[0].exists) {
          // create table
          await pool.query(createTableQuery);
          // ini tidak perlu karena otomatis buat btree index untuk field yg unik
          // await pool.query(createIndexQuery);
          console.log(`${exports.tableName} table created successfully`);

          // insert admin user
          const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
          );
          const query =
            "INSERT INTO " +
            exports.tableName +
            " (display_name, email, username, password, role, email_validation) VALUES ($1, $2, $3, $4, $5, $6)";
          await pool.query(query, [
            "Admin",
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_USERNAME,
            hashedPassword,
            Role.admin,
            1,
          ]);
          console.log(`Admin record created successfully`);
        } else {
          console.log(`${exports.tableName} table exist`);
          console.log(`Admin record exist`);
        }
      }
    );
  } catch (error) {
    console.error(`Error creating ${exports.tableName} table:`, error);
  }
};
