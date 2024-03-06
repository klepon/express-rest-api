/* update my profile
* auth header and response
* body {display_name: string, email: string, username: string, avatar_id: number, bio: string, address: string, latlng: string}
* return 1 sukkses, 0 fail
* error:
  - auth header error
  - 500, Internal Server Error
*/

const pool = require("../../database/pool.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { handleErrors } = require("../../util/error.js");
const { tableName } = require("../database.js");
const { generateRandomNumber } = require("../util.js");

exports.updateProfile = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(
      req.body,
      [
        "display_name",
        "email",
        "username",
        "avatar_id",
        "bio",
        "address",
        "latlng",
      ],
      true
    );

    const { display_name, email, username, avatar_id, bio, address, latlng } =
      req.body;

    // check if email change
    let query = "SELECT email FROM " + tableName + " WHERE puid = $1";
    let result = await pool.query(query, [req.user.puid]);
    const emailValidation =
      result.rows[0].email !== email
        ? ", email_validation=" + generateRandomNumber()
        : "";

    // make query
    query =
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
      req.user.puid,
    ];
    result = await pool.query(query, value);
    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
