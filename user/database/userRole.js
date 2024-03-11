const pool = require("../../database/pool.js");
const { roles, tableRole } = require("../../role/constant.js");
const { tableUserRole, tableUser } = require("../constant.js");
const { checkTableQuery } = require("../../util/constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableUserRole} (
    uid INTEGER NOT NULL,
    rid INTEGER NOT NULL
  )
`;

const assignSuperAdminRole = async () => {
  const query = `INSERT INTO ${tableUserRole} (uid, rid)
    SELECT ${tableRole}.rid AS rid, ${tableUser}.uid AS uid
    FROM ${tableRole}, ${tableUser}
    WHERE ${tableRole}.name = $1
    AND ${tableUser}.display_name = $2`;

  await pool.query(query, [roles.superAdmin, roles.superAdmin]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    await pool.query(`CREATE INDEX idx_urid ON ${tableUserRole} (uid);`);
    console.log(`* ${tableUserRole}: table created successfully`);

    await assignSuperAdminRole();
    console.log(`* ${tableUserRole}: ${roles.superAdmin} role assigned \n`);
  } catch (error) {
    console.error(`** Error creating table ${tableUserRole}:`, error);
  }
};

exports.createTableUserRole = async () => {
  try {
    const result = await pool.query(checkTableQuery, [tableUserRole]);

    if (result.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableUserRole};`);
        await createTable();
      } else console.log(`* ${tableUserRole}: exist`);
    } else {
      await createTable();
    }
  } catch (error) {
    console.error(`** Error checking table ${tableUserRole}:`, error);
  }
};
