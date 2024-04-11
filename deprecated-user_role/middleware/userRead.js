/** 
 * get user data
 *
 * required:
 * permission: -r--:USER:{puid}; USER:{ME}, USER:*
 * req.userData: { puid: uuid-v4, permission: [string] }
 * 
* use: auth
* update req.userData = {
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
* return code, body
* 404, User not found
* 500, Internal Server Error
*/

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { table } = require("../constant.js");

exports.getUser = async (req, res, next) => {
  try {
    const query = `SELECT * FROM ${table.user} WHERE puid = $1`;
    const result = await pool.query(query, [req.userPuid]);

    if (result.rowCount !== 1) {
      res.status(404).send("User not found");
    }

    req.userData = result.rows[0];
    next();
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
