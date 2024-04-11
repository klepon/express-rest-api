/** login, see input validation for body value
 * POST
 * body { username: string, password: string }
 * return code, body:
 * 200, { token: string }
 * 401, Invalid user or password
 * 500, Internal Server Error
 */

const bcrypt = require("bcrypt");
const { table } = require("./constant.js");
const { throwError } = require("../../util/error.js");
const { createJwtToken } = require("./auth.js");
const pool = require("../../database/pool.js");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const query = `SELECT password, puid FROM ${table.user} WHERE username = $1`;
    const result = await pool.query(query, [username]);

    if (!result.rows.length) {
      throwError(401, "Login user not found");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw throwError(401, "Login invalid password");
    }

    const token = createJwtToken({ puid: user.puid });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
