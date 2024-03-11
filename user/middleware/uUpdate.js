/** update my profile, see input validation for body value
* use: auth, user
* POST
* body {
    "display_name": string
    "email": string
    "username": string
    "avatar_id": number | empty string
    "bio": string | empty string
    "address": string | empty string
    "latlng": string | empty string
  }
* return code, body
* 200, 1 success, 0 fail
* 500, {
    "error": {
        "code": 500,
        "severity": "ERROR",
        "detail": "Internal Server Error" | "Mising properties",
        "items": [] | [coloumn_name]
    }
  }
}
* auth header error code and body
*/

const pool = require("../../database/pool.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { handleErrors } = require("../../util/error.js");
const { tableName } = require("../database/user.js");
const { generateRandomNumber } = require("../util.js");

exports.update = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(req.body, [
      "display_name",
      "email",
      "username",
      "avatar_id",
      "bio",
      "address",
      "latlng",
    ]);

    const { display_name, email, username, avatar_id, bio, address, latlng } =
      req.body;

    // check if email change
    if (req.userData) {
      const emailValidation =
        req.userData.email !== email
          ? ", email_validation=" + generateRandomNumber()
          : "";

      // make query
      const query =
        "UPDATE " +
        tableName +
        " SET display_name = $1, email = $2, username = $3, avatar_id = $4, bio = $5, address = $6, latlng = $7" +
        emailValidation +
        " WHERE puid = $8 AND is_blocked = 'f'";
      const value = [
        display_name,
        email,
        username,
        parseInt(avatar_id) || null,
        bio || null,
        address || null,
        latlng || null,
        req.userPuid,
      ];
      const result = await pool.query(query, value);
      res.status(200).json(result.rowCount);
    }
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
