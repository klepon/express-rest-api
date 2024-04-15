/** update my profile
 *
 * required
 * object req.userAuthData
 * object req.cleanData
 *
 * passing on success:
 * string req.onFinish
 *
 * response
 * 200 User updated successfully
 * 400
 * - Nothing to update
 * - Fail updating user
 */

const pool = require("../../database/pool");
const { throwError } = require("../../util/error");
const { table, onFinishUser } = require("./constant");
const { generateRandomNumber } = require("./util");

exports.updateUser = async (req, res, next) => {
  try {
    const coloumns = [];
    const values = [];

    req.cleanData.update_at = new Date();

    if (req.cleanData.email && req.userAuthData.email !== req.cleanData.email) {
      req.cleanData.email_validation = generateRandomNumber();
    }

    let index = 0;
    for (const prop of Object.keys(req.cleanData)) {
      const { [prop]: current = null } = req.userAuthData;
      const { [prop]: newData = null } = req.cleanData;

      if (newData && current !== newData) {
        index++;
        coloumns.push(`${prop} = $${index}`);
        if (prop === "avatar_id") {
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

    if (index <= 1) {
      throwError(400, "Update user", "Nothing to update");
    }

    const result = await pool.query(query, values);

    if (!result.rowCount) {
      throwError(400, "Update user", "Fail updating user");
    }

    if (req.userAuthData.email !== req.cleanData.email) {
      req.onFinish = onFinishUser.emailUpdated;
    }

    req.onFinish = onFinishUser.updated;
    res.status(200).send("User updated successfully");
  } catch (error) {
    next(error);
  }
};
