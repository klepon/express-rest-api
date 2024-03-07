
/* login
* POST
* body { username: string, password: string }
* return code, body:
* 200, { token: string }
* 401, Invalid user or password
* 500, Internal Server Error
*/

const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { createJwtToken } = require("../util.js");
const { debugError } = require("../../util/error.js");
const { tableName } = require("../database.js");

exports.login = async (req, res) => {
  try {
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
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
