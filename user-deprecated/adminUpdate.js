/** update profile by admin
 * use: auth, user, adminPuid
* POST
* body {
    "is_blocked": boolean
    "role": string: Role
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
*/

const pool = require("../database/pool.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { handleErrors } = require("../util/error.js");
const { tableName } = require("../database/user.js");

exports.adminUpdate = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(req.body, ["is_blocked", "role"]);

    const { is_blocked, role } = req.body;
    const query =
      "UPDATE " + tableName + " SET is_blocked = $1, role = $2 WHERE puid = $3";
    const value = [is_blocked, role, req.userPuid];
    const result = await pool.query(query, value);
    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
