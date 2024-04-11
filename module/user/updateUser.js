/** update my profile, see input validation for body value
 *
 * required
 * string req.userAuthPuid from ./auth.js
 * object req.userAuthData
 * object req.cleanData from ./registerData.js
 *
 * response
 * /utis/inputValidation.js error
 * 200, 1 success, 0 fail
 */

const pool = require("../../database/pool");
const { table } = require("./constant");
const { generateRandomNumber } = require("./util");

exports.updateUser = async (req, res, next) => {
  try {
    const { display_name, email, username, avatar_id, bio, address, latlng } =
      req.cleanData;

    // check if email change
    const emailValidation =
      req.userAuthData.email !== email
        ? `, email_validation = ${generateRandomNumber()}`
        : "";

    // make query
    const query = `UPDATE ${table.user} SET display_name = $1, email = $2, username = $3, avatar_id = $4, bio = $5, address = $6, latlng = $7 ${emailValidation} WHERE puid = $8 AND is_blocked = 'f'`;
    const value = [
      display_name,
      email,
      username,
      parseInt(avatar_id) || null,
      bio || null,
      address || null,
      latlng || null,
      req.userAuthPuid,
    ];
    // todo add update at
    // todo validate timezone, 
    const result = await pool.query(query, value);
    res.status(200).json(result.rowCount);
  } catch (error) {
    next(error);
  }
};
