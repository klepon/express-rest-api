/* public profile
* GET
* params puid: string
* return code, body
* 200, {
    "display_name": string
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
  }
* 404, User not found
* 500, Internal Server Error
*/

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { tableName } = require("../database.js");

exports.publicProfile = async (req, res, _next) => {
  try {
    const query =
      "SELECT display_name, avatar_id, bio, address, latlng FROM " +
      tableName +
      " WHERE puid = $1 AND is_blocked = 'f'";
    const result = await pool.query(query, [req.params.puid]);
    if (result.rows.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
