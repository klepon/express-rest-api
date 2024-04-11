/** update my profile, see input validation for body value
 *
 * required
 * array req.reqInputProps from ./updateData.js
 * object req.userAuthData from ./readUser.js
 * object req.cleanData from ./registerData.js
 *
 * response
 * /utis/inputValidation.js error
 * 200, 1 success, 0 fail
 */

const pool = require("../../database/pool");
const { throwError } = require("../../util/error");
const { table } = require("./constant");
const { generateRandomNumber } = require("./util");

exports.updateUser = async (req, res, next) => {
  try {
    const coloumns = [];
    const values = [];
    let index = 0;
    for (const prop of req.reqInputProps) {
      const { [prop]: current = null } = req.userAuthData;
      const { [prop]: newData = null } = req.cleanData;

      if (current !== newData) {
        index++;
        coloumns.push(`${prop} = $${index}`);
        if (
          prop === "email_validation" &&
          req.userAuthData.email !== req.cleanData.email
        ) {
          values.push(generateRandomNumber());
        } else if (prop === "avatar_id") {
          values.push(parseInt(newData));
        } else {
          values.push(newData);
        }
      }
    }

    const query = `UPDATE ${table.user} SET ${coloumns.join(
      ", "
    )} WHERE puid = $${index + 1} AND is_blocked = 'f'`;
    values.push(req.userAuthPuid);

    if (values.length === 1) {
      throwError(400, "Update user", "Nothing to update");
    }

    // todo add update at
    // todo validate timezone,
    const result = await pool.query(query, values);
    res.status(200).json(result.rowCount);
  } catch (error) {
    next(error);
  }
};
