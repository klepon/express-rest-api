/* delete
 * auth header and response
 * body { password: string }
 * return code, body
 * 200, 1 success, 0 fail
 * 401, Invalid session or password
 * 500, Internal Server Error
 * auth header error code and body
 */

const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { tableName } = require("../database.js");

exports.remove = async (req, res, _next) => {
  try {
    // check if current user password match
    const { password } = req.body;
    let query = "SELECT password, uid FROM " + tableName + " WHERE puid = $1";
    let result = await pool.query(query, [req.user.puid]);

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid session or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid session or password");
    }

    // execute delete user
    query = "DELETE FROM " + tableName + " WHERE uid = $1";
    await pool.query(query, [user.uid]);
    res.status(200).json(result.rowCount);
    // delete table related to this uid will be handle by middleware on each service
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
