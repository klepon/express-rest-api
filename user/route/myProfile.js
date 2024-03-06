
/* my profile
* auth header and response
* return {display_name: string, email: string, username: string, email_validation: number, is_blocked: string(f/t), role: string, avatar_id: number, bio: string, address: string, latlng: string, puid:string}
* error:
  - auth header error
  - 500, Internal Server Error
*/

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { tableName } = require("../database.js");

exports.myProfile = async (req, res) => {
  try {
    const query =
      "SELECT display_name, email, username, email_validation, is_blocked, role, avatar_id, bio, address, latlng, puid FROM " +
      tableName +
      " WHERE puid = $1";
    const result = await pool.query(query, [req.user.puid]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
