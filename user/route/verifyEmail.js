/** email verification, see input validation for body value
* useL auth
* POST
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
*/

const pool = require("../../database/pool.js");
const { handleErrors } = require("../../util/error.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { tableName } = require("../database/user.js");

exports.verifyEmail = async (req, res, _next) => {
  try {
    propertyChecker(req.body, ["code"]);
    
    const query =
      "UPDATE " +
      tableName +
      " SET email_validation = $1 WHERE puid = $2 AND email_validation = $3";
    const value = [1, req.userPuid, req.body.code];
    const result = await pool.query(query, value);

    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
