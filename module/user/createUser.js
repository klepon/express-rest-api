/** 
 * create user record
 * 
 * required: 
 * object req.body
 * 
 * response:
 * next()
 * 500, { "detail": default 500 message }
 * 500, {
  "code": "23505",
  "detail": "Key (username)=(some_username) already exists." 
    | "Key (email)=(some_email_address) already exists."
 }
 */

const bcrypt = require("bcrypt");
const pool = require("../../database/pool");
const { generateRandomNumber } = require("./util");
const { throwError } = require("../../util/error");

exports.createUser = async (req, _res, next) => {
  try {
    const { display_name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${table.user} (display_name, email, username, password, email_validation) VALUES ($1, $2, $3, $4, $5)`;
    const result = await pool.query(query, [
      display_name,
      email,
      username,
      hashedPassword,
      generateRandomNumber(),
    ]);
    if (!result.rowCount) {
      throwError(400, "create user")
    }
    next();
  } catch (error) {
    next(error);
  }
};
