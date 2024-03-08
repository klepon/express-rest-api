/** login, see input validation for body value
 * POST
 * body { username: string, password: string }
 * return code, body:
 * 200, { token: string }
 * 401, Invalid user or password
 * 500, Internal Server Error
 */

const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { handleErrors } = require("../../util/error.js");
const { tableName } = require("../database.js");
const { createJwtToken } = require("../middleware/auth.js");
const { propertyChecker } = require("../../util/propertyChecker.js");

exports.login = async (req, res) => {
  try {
    propertyChecker(req.body, ["username", "password"]);

    const { username, password } = req.body;
    const query =
      "SELECT password, puid FROM " + tableName + " WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid user or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid user or password");
    }

    const token = createJwtToken({ puid: user.puid });
    res.status(200).json({ token });
  } catch (error) {
    handleErrors(error, res, 500)
  }
};
