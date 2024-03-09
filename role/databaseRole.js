const pool = require("../database/pool.js");
const { tableRole, roleSuperAdmin, tablePermission, tableRolePermission } = require("./constant.js");
const { createTablePermission } = require("./databasePermission.js");
const { createTableRolePermission } = require("./databaseRolePermission.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableRole} (
    rid SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
  )
`;

const insertDefault = async () => {
  const query = `INSERT INTO ${tableRole} (name) VALUES ($1)`;
  await pool.query(query, [roleSuperAdmin]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tableRole}: table created successfully`);

    await insertDefault();
    console.log(
      `* ${tableRole}: ${roleSuperAdmin} role created successfully \n`
    );
  } catch (error) {
    console.error(`** Error creating table ${tableRole}:`, error);
  }
};

exports.createTableRole = async () => {
  try {
    const role = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)",
      [tableRole]
    );

    const permission = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)",
      [tablePermission]
    );

    const rolePermission = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)",
      [tableRolePermission]
    );

    if (role.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableRole};`);
        await createTable();
      } else console.log(`* ${tableRole}: exist`);
    } else await createTable();

    if (permission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tablePermission};`);
        await createTablePermission();
      } else console.log(`* ${tablePermission}: exist`);
    } else await createTablePermission();

    if (rolePermission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableRolePermission};`);
        await createTableRolePermission();
      } else console.log(`* ${tableRolePermission}: exist`);
    } else await createTableRolePermission();
  } catch (error) {
    console.error(`** Error checking table role:`, error);
  }
};
