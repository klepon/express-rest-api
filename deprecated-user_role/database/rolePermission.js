const pool = require("../../database/pool.js");
const { permissions, roles, table } = require("../constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${table.rolePermission} (
    rid INTEGER NOT NULL,
    pid INTEGER NOT NULL
  )
`;

const insertDefault = async () => {
  const query = `INSERT INTO ${table.rolePermission} (rid, pid)
    SELECT ${table.role}.rid AS rid, ${table.permission}.pid AS pid
    FROM ${table.role}, ${table.permission}
    WHERE ${table.role}.name = $1
    AND ${table.permission}.permission = ANY($2)`;

  const { superAdmin, userAdmin, userMe, userFriend, userGroup } = permissions;
  const { superAdmin: superAdminRole, admin, user } = roles;
  await pool.query(query, [superAdminRole, [superAdmin]]);
  await pool.query(query, [admin, [userAdmin]]);
  await pool.query(query, [user, [userMe, userFriend, userGroup]]);

  // const rids = await getRoleID(Object.values(roles));
  // const pids = await getPermissionIDs(Object.values(permissions));
  // if (rids.length > 0 && pids.length > 0) {
  //   const query = `INSERT INTO ${table.rolePermission} (rid, pid) VALUES ($1, $2)`;
  //   await pool.query(query, [
  //     rids.find(rid, rid.name === roles.superAdmin).rid,
  //     pids.find((pid) => pid.permission === permissions.superAdmin),
  //   ]);

  //   const userRid = rids.find(rid, rid.name === roles.user).rid;
  //   await pool.query(query, [
  //     userRid,
  //     pids.find((pid) => pid.permission === permissions.userMe),
  //   ]);
  // }
};

exports.createTableRolePermission = async () => {
  try {
    await pool.query(createTableQuery);
    await pool.query(`CREATE INDEX idx_rpid ON ${table.rolePermission} (rid);`);
    console.log(`* ${table.rolePermission}: table created successfully`);

    await insertDefault();
    console.log(
      `* ${table.rolePermission}: role and permission linked successfully \n`
    );
  } catch (error) {
    console.error(`** Error creating table ${table.rolePermission}:`, error);
  }
};
