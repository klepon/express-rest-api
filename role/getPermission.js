const pool = require("../database/pool.js");
const { tableRole, tablePermission } = require("./constant.js");

// const generatePermission = (data) => {
//   return data.map((role) => {
//     const roles = [];
//     ["c", "r", "u", "d"].forEach((key) => {
//       roles.push(role[key] ? 1 : 0);
//     });
//     return `${roles.join("")}:${role.permission}`;
//   });
// };

exports.getRoleID = async (name) => {
  const rs = await pool.query(`SELECT rid FROM ${tableRole} WHERE name = $1`, [
    name,
  ]);
  if (rs.rowCount === 0) return "";
  return rs.rows[0].rid;
};

exports.getPermissionID = async (permission) => {
  const rs = await pool.query(
    `SELECT pid FROM ${tablePermission} WHERE permission = $1`,
    [permission]
  );
  if (rs.rowCount === 0) return "";
  return rs.rows[0].pid;
};

// exports.getPermissionByIds = async (ids) => {
//   const rs = await pool.query(
//     `SELECT * FROM ${tableName} WHERE rid = ANY($1)`,
//     [ids]
//   );
//   if (rs.rowCount === 0) return "";
//   return generatePermission(rs.rows);
// };
