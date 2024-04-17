/** 
 * get user data
 *
 * required:
 * uuid-v4 req.userAuthPuid
 * 
 * passing
 * req.userAuthData, return all coloumn in userTable() at ./table.js
 * 
 * response
 * 404, User not found
 * 500, Internal Server Error
*/

const pool = require("../../../database/pool");
const { throwError } = require("../../../util/error");
const { table } = require("../constant");


exports.readUser = async (req, res, next) => {
  try {
    const query = `SELECT * FROM ${table.user} WHERE puid = $1`;
    const result = await pool.query(query, [req.userAuthPuid]);

    if (result.rowCount !== 1) {
      throwError(404, "Read user", "User not found")
    }

    req.userAuthData = result.rows[0];
    next();
  } catch (error) {
    next(error)
  }
};
