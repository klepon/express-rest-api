const pool = require("../database/pool.js");
const { tableRolePermission, roleSuperAdmin } = require("./constant.js");
const { getRoleID, getPermissionID } = require("./getPermission.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableRolePermission} (
    rpid SERIAL PRIMARY KEY,
    rid INTEGER NOT NULL,
    pid INTEGER NOT NULL
  )
`;

const insertDefault = async () => {
  const rid = await getRoleID(roleSuperAdmin);
  const pid = await getPermissionID("*");
  const query = `INSERT INTO ${tableRolePermission} (rid, pid) VALUES ($1, $2)`;
  await pool.query(query, [rid, pid]);
};

exports.createTableRolePermission = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tableRolePermission}: table created successfully`);

    await insertDefault();
    console.log(`* ${tableRolePermission}: ${roleSuperAdmin} role permission linked successfully \n`);
  } catch (error) {
    console.error(`** Error creating table ${tableRolePermission}:`, error);
  }
};
