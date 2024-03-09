/** delete
 * use: auth, user, adminPuid
 * GET
 * params puid: string
 * return code, body
 * 200, 1 success, 0 fail
 * 500, Internal Server Error
 */

const pool = require("../../database/pool.js");
const { tableName } = require("../database/user.js");
const { debugError } = require("../../util/error.js");
const { deletedUid } = require("../../util/constant.js");

exports.adminRemove = async (req, res, _next) => {
  try {
    if (req.userData) {
      // record uid in request for use onFinish
      req[deletedUid] = req.userData.uid;

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
