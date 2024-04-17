/** 
 * create user record
 * 
 * required: 
 * object req.cleanData
 * 
 * passing on success: 
 * string req.onFinish
 * 
 * response:
 * 200 User registered successfully
 * 400
 * 500, {
  "code": "23505",
  "detail": "Key (username)=(some_username) already exists." 
    | "Key (email)=(some_email_address) already exists."
 }
 */

const bcrypt = require("bcrypt");
const pool = require("../../../database/pool");
const { generateRandomNumber } = require("../util");
const { throwError } = require("../../../util/error");
const { table, onFinishUser } = require("../constant");

exports.createUser = async (req, res, next) => {
  try {
    req.cleanData.email_validation = generateRandomNumber();
    const { display_name, email, username, password, email_validation } =
      req.cleanData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${table.user} (display_name, email, username, password, email_validation) VALUES ($1, $2, $3, $4, $5)`;
    const result = await pool.query(query, [
      display_name,
      email,
      username,
      hashedPassword,
      email_validation,
    ]);

    if (!result.rowCount) {
      throwError(400, "Create user");
    }

    req.onFinish = onFinishUser.emailUpdated;
    res.status(200).send("User registered successfully");
  } catch (error) {
    next(error);
  }
};
