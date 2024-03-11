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
const { tableUserRole, tableUser } = require("../../user/constant.js");
const { debugError } = require("../../util/error.js");
const { tableRole } = require("../constant.js");

exports.assignRole = async (req, res, next) => {
  try {
    const query = `INSERT INTO ${tableUserRole} (uid, rid)
    SELECT ${tableUser}.uid AS uid, ${tableRole}.rid AS rid
    FROM ${tableRole}, ${tableUser}
    WHERE ${tableRole}.name = $1
    AND ${tableUser}.username = $2`;
    const result = await pool.query(query, [req.roleName, req.body.username]);

    req.resultAssignRole = result.rowCount;
    next();
  } catch (error) {
    debugError(error, "Role: assignRole catch block");
    next(error);
  }
};
