/* update profile by admin
* POST
* auth header and response
* body {
    "is_blocked": boolean
    "role": string
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
const { tableName } = require("../database.js");

exports.adminUpdate = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(req.body, ["is_blocked", "role"], true);

    const { is_blocked, role } = req.body;
    query =
      "UPDATE " + tableName + " SET is_blocked = $1, role = $2 WHERE puid = $3";
    const value = [is_blocked, role, req.user.puid];
    result = await pool.query(query, value);
    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
