/**
 * set default role for register user
 *
 * response:
 * string req.roleName
 */

const { roles } = require("../../role/constant");

exports.setRole = async (req, _res, next) => {
  req.roleName = roles.user;
  next();
};
