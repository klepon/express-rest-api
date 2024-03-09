const pool = require("../../database/pool.js");
const {
  tablePermission,
  permissions,
} = require("../constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tablePermission} (
    pid SERIAL PRIMARY KEY,
    permission VARCHAR(100) UNIQUE NOT NULL,
    c BOOLEAN DEFAULT FALSE,
    r BOOLEAN DEFAULT FALSE,
    u BOOLEAN DEFAULT FALSE,
    d BOOLEAN DEFAULT FALSE,
    editable BOOLEAN DEFAULT TRUE
  )
`;

const insertDefault = async () => {
  const { superAdmin, userAdmin, userMe, userFriend, userGroup } = permissions;
  const query = `INSERT INTO ${tablePermission} (permission, c, r, u, d, editable) VALUES ($1, $2, $3, $4, $5, $6)`;
  await pool.query(query, [superAdmin, true, true, true, true, false]);
  await pool.query(query, [userAdmin, true, true, true, true, false]);
  await pool.query(query, [userMe, true, true, true, true, false]);
  await pool.query(query, [userFriend, false, true, false, false, false]);
  await pool.query(query, [userGroup, false, true, false, false, false]);
};

exports.createTablePermission = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tablePermission}: table created successfully`);

    await insertDefault();
    console.log(
      `* ${tablePermission}: ${roleSuperAdmin} permission created successfully \n`
    );
  } catch (error) {
    console.error(`** Error creating table ${tablePermission}:`, error);
  }
};
