/** 
 * get user data
 *
 * required:
 * req.userAuthPuid: uuid-v4
 * 
 * passing
 * req.userAuthData = {
    "uid": uuid
    "password": string
    "display_name": string
    "email": string
    "username": string
    "email_validation": number, 1 === valid
    "is_blocked": boolean
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
    "puid": string
    "permission": json
  }
 * response
 * 404, User not found
 * 500, Internal Server Error
*/

const pool = require("../../database/pool");
const { throwError } = require("../../util/error");
const { table } = require("./constant");


exports.readUser = async (req, res, next) => {
  try {
    const query = `SELECT * FROM ${table.user} WHERE puid = $1`;
    const result = await pool.query(query, [req.userAuthPuid]);

    if (result.rowCount !== 1) {
      throwError(404, "Read user", "user not found")
    }

    req.userAuthData = result.rows[0];
    next();
  } catch (error) {
    next(error)
  }
};
