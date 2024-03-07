/* my profile
* GET
* auth header and response
* return code, body
* 200, {
    "display_name": string
    "email": string
    "username": string
    "email_validation": number, 1 === valid
    "is_blocked": boolean
    "role": string
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
    "puid": string
  }
* 500, Internal Server Error
* auth header error code and body
*/

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { filterObject } = require("../../util/filterObject.js");
const { tableName } = require("../database.js");

exports.profile = async (req, res, next) => {
  try {
    const query = "SELECT * FROM " + tableName + " WHERE puid = $1";
    const result = await pool.query(query, [req.user.puid]);

    if (req.isMiddleWare) {
      req.userData = result.rows[0];
      next();
    } else {
      const privateData = [
        "display_name",
        "email",
        "username",
        "email_validation",
        "is_blocked",
        "role",
        "avatar_id",
        "bio",
        "address",
        "latlng",
        "puid",
      ];
      res.status(200).json(filterObject(result.rows[0], privateData));
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
