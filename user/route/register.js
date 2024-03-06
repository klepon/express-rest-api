/* register
* body { display_name: string, email: string, username: string, password: string }
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
const { tableName } = require("../database.js");
const { generateRandomNumber } = require("../util.js");

exports.register = async (req, res, _next) => {
  try {
    // check for missing property
    propertyChecker(
      req.body,
      ["display_name", "email", "username", "password"],
      true
    );

    const { display_name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO " +
      tableName +
      " (display_name, email, username, password, role, email_validation) VALUES ($1, $2, $3, $4, $5, $6)";
    await pool.query(query, [
      display_name,
      email,
      username,
      hashedPassword,
      "user",
      generateRandomNumber(),
    ]);
    res.status(201).send("User registered successfully");
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
