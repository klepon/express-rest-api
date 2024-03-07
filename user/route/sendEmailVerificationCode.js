/* send email verification code
 * GET
 * auth header and response
 * return code, body
 * 200, Email sent
 * auth header error code and body
 * get profile error response
 */

const pool = require("../../database/pool.js");
const { handleErrors } = require("../../util/error.js");
const { maskEmail } = require("../../util/maskEmail.js");
const { tableName } = require("../database.js");

// todo: change this to use get profile
exports.sendEmailVerificationCode = async (req, res, _next) => {
  try {
    if (req.userData) {
      console.log(
        "========= send email code via email: ",
        maskEmail(req.userData.email),
        req.userData.email_validation
      );

      // todo: next send email
    }

    res.status(200).json("Email sent");
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
