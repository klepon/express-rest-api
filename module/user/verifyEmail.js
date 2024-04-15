/** verify user email
 *
 * required
 * array req.reqInputProps
 * object req.userAuthData
 * object req.cleanData
 *
 * response
 * /utis/inputValidation.js error
 * 200 success
 * 400 fail
 */

const pool = require("../../database/pool.js");
const { throwError } = require("../../util/error.js");
const { table, validEmailValue } = require("./constant.js");

exports.verifyEmail = async (req, res, next) => {
  try {
    if(req.userAuthData.email_validation === validEmailValue) {
      throwError(400, "Verify email", "Email already verified");
    }

    const query = `UPDATE ${table.user} SET email_validation = $1 WHERE puid = $2 AND email_validation = $3 AND is_blocked = 'f'`;
    const value = [validEmailValue, req.userAuthData.puid, req.cleanData.code];
    const result = await pool.query(query, value);

    if (!result.rowCount) {
      throwError(400, "Verify email", "Email verified fail");
    }

    res.status(200).json("Email verified successfully");
  } catch (error) {
    next(error);
  }
};
