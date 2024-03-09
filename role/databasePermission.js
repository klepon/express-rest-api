const pool = require("../database/pool.js");
const { tablePermission, roleSuperAdmin } = require("./constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tablePermission} (
    pid SERIAL PRIMARY KEY,
    permission VARCHAR(255) UNIQUE NOT NULL,
    c BOOLEAN DEFAULT FALSE,
    r BOOLEAN DEFAULT FALSE,
    u BOOLEAN DEFAULT FALSE,
    d BOOLEAN DEFAULT FALSE
  )
`;

const insertDefault = async () => {
  const query = `INSERT INTO ${tablePermission} (permission, c, r, u, d) VALUES ($1, $2, $3, $4, $5)`;
  await pool.query(query, ["*", true, true, true, true]);
};

exports.createTablePermission = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tablePermission}: table created successfully`);

    await insertDefault();
    console.log(`* ${tablePermission}: ${roleSuperAdmin} permission created successfully \n`);
  } catch (error) {
    console.error(`** Error creating table ${tablePermission}:`, error);
  }
};
