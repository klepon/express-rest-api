const pool = require("../../database/pool.js");
const { roles, table } = require("../constant.js");
const { checkTableQuery } = require("../../util/constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${table.userRole} (
    uid INTEGER NOT NULL,
    rid INTEGER NOT NULL
  )
`;

const assignSuperAdminRole = async () => {
  const query = `INSERT INTO ${table.userRole} (uid, rid)
    SELECT ${table.role}.rid AS rid, ${table.user}.uid AS uid
    FROM ${table.role}, ${table.user}
    WHERE ${table.role}.name = $1
    AND ${table.user}.display_name = $2`;

  await pool.query(query, [roles.superAdmin, roles.superAdmin]);
};

exports.createTableUserRole = async () => {
  try {
    await pool.query(createTableQuery);
    await pool.query(`CREATE INDEX idx_urid ON ${table.userRole} (uid);`);
    console.log(`* ${table.userRole}: table created successfully`);

    await assignSuperAdminRole();
    console.log(`* ${table.userRole}: ${roles.superAdmin} role assigned \n`);
  } catch (error) {
    console.error(`** Error creating table ${table.userRole}:`, error);
  }
};
