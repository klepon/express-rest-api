/** delete, see input validation for body value
 * use: auth, user
 * POST
 * body { password: string }
 * return code, body
 * 200, 1 success, 0 fail
 * 401, Invalid session or password
 * 500, Internal Server Error
 */

const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { tableName } = require("../database.js");
const { debugError } = require("../../util/error.js");
const { deletedUid } = require("../../util/constant.js");
const { propertyChecker } = require("../../util/propertyChecker.js");

exports.remove = async (req, res, _next) => {
  try {
    propertyChecker(req.body, ["password"]);
    
    if (req.userData) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        req.userData.password
      );
      if (!validPassword) {
        return res.status(401).send("Invalid session or password");
      }

      // record uid in request for use onFinish
      req[deletedUid] = req.userData.uid;

      // execute delete user
      const result = await pool.query(
        "DELETE FROM " + tableName + " WHERE uid = $1",
        [req.userData.uid]
      );
      res.status(200).json(result.rowCount);
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
