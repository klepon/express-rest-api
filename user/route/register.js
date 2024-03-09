/** register, see input validation for body value
* POST
* body { 
  display_name: string, 
  email: string, 
  username: string, 
  password: string 
}
* return code, body: 
* 201, User registered successfully
* 500, {
    "error": {
      "code": "23505",
      "severity": "ERROR",
      "detail": "Key (username)=(klep2) already exists." | "Key (email)=(test+1@test.com) already exists."
      "items": []
    }
  }
*/

const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { handleErrors } = require("../../util/error.js");
const { generateRandomNumber } = require("../util.js");
const { tableUser } = require("../constant.js");

exports.register = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(req.body, [
      "display_name",
      "email",
      "username",
      "password",
    ]);

    const { display_name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${tableUser} (display_name, email, username, password, email_validation) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [
      display_name,
      email,
      username,
      hashedPassword,
      generateRandomNumber(),
    ]);
    res.status(201).send("User registered successfully");
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
