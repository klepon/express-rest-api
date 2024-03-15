/**
 * assign role to user
 *
 * required:
 * object req.body, contain username: string
 * string req.roleName
 *
 * response:
 * integer req.resultAssignRole, 1 success, 0 fail
 * 500, { "detail": default 500 message }
 */

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { table } = require("../constant.js");

exports.assignRole = async (req, res, next) => {
  try {
    const query = `INSERT INTO ${table.userRole} (uid, rid)
    SELECT ${table.user}.uid AS uid, ${table.role}.rid AS rid
    FROM ${table.role}, ${table.user}
    WHERE ${table.role}.name = $1
    AND ${table.user}.username = $2`;
    const result = await pool.query(query, [req.roleName, req.body.username]);

    req.resultAssignRole = result.rowCount;
    next();
  } catch (error) {
    debugError(error, "Role: assignRole catch block");
    next(error);
  }
};
