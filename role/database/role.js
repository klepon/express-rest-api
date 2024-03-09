const pool = require("../../database/pool.js");
const { checkTableQuery } = require("../../util/constant.js");
const {
  tableRole,
  tablePermission,
  tableRolePermission,
  roles,
} = require("../constant.js");
const { createTablePermission } = require("./permission.js");
const { createTableRolePermission } = require("./rolePermission.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableRole} (
    rid SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
  )
`;

const insertDefault = async () => {
  const query = `INSERT INTO ${tableRole} (name) VALUES ($1)`;
  await pool.query(query, [roles.superAdmin]);
  await pool.query(query, [roles.admin]);
  await pool.query(query, [roles.user]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tableRole}: table created successfully`);

    await insertDefault();
    console.log(
      `* ${tableRole}: roles created successfully \n`
    );
  } catch (error) {
    console.error(`** Error creating table ${tableRole}:`, error);
  }
};

exports.createTableRole = async () => {
  try {
    const role = await pool.query(checkTableQuery, [tableRole]);
    const permission = await pool.query(checkTableQuery, [tablePermission]);
    const rolePermission = await pool.query(checkTableQuery, [
      tableRolePermission,
    ]);

    if (role.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableRole}`);
        await createTable();
      } else console.log(`* ${tableRole}: exist`);
    } else await createTable();

    if (permission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tablePermission}`);
        await createTablePermission();
      } else console.log(`* ${tablePermission}: exist`);
    } else await createTablePermission();

    if (rolePermission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableRolePermission}`);
        await createTableRolePermission();
      } else console.log(`* ${tableRolePermission}: exist`);
    } else await createTableRolePermission();
  } catch (error) {
    console.error(`** Error checking table role:`, error);
  }
};
