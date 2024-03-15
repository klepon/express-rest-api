const pool = require("../../database/pool.js");
const { checkTableQuery } = require("../../util/constant.js");
const { roles, table } = require("../constant.js");
const { createTablePermission } = require("./permission.js");
const { createTableRolePermission } = require("./rolePermission.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${table.role} (
    rid SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
  )
`;

const insertDefault = async () => {
  const query = `INSERT INTO ${table.role} (name) VALUES ($1)`;
  await pool.query(query, [roles.superAdmin]);
  await pool.query(query, [roles.admin]);
  await pool.query(query, [roles.user]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${table.role}: table created successfully`);

    await insertDefault();
    console.log(`* ${table.role}: roles created successfully \n`);
  } catch (error) {
    console.error(`** Error creating table ${table.role}:`, error);
  }
};

exports.createTableRole = async () => {
  try {
    const role = await pool.query(checkTableQuery, [table.role]);
    const permission = await pool.query(checkTableQuery, [table.permission]);
    const rolePermission = await pool.query(checkTableQuery, [
      table.rolePermission,
    ]);

    if (role.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${table.role}`);
        await createTable();
      } else console.log(`* ${table.role}: exist`);
    } else await createTable();

    if (permission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${table.permission}`);
        await createTablePermission();
      } else console.log(`* ${table.permission}: exist`);
    } else await createTablePermission();

    if (rolePermission.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${table.rolePermission}`);
        await createTableRolePermission();
      } else console.log(`* ${table.rolePermission}: exist`);
    } else await createTableRolePermission();
  } catch (error) {
    console.error(`** Error checking table role:`, error);
  }
};
