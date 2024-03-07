/* email verification
* POST
* auth header and response
* body {
    "code": string
  }
* return code, body
* 200, 1 success, 0 fail
* 500, {
    "error": {
        "code": 500,
        "severity": "ERROR",
        "detail": "Internal Server Error",
        "items": []
    }
  }
}
* auth header error code and body
*/

const pool = require("../../database/pool.js");
const { handleErrors } = require("../../util/error.js");
const { tableName } = require("../database.js");

exports.verifyEmail = async (req, res, _next) => {
  try {
    const query =
      "UPDATE " +
      tableName +
      " SET email_validation = $1 WHERE puid = $2 AND email_validation = $3";
    const value = [1, req.user.puid, req.body.code];
    const result = await pool.query(query, value);

    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
