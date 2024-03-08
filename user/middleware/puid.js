const { Role } = require("../constant");

/** set puid as admin
 * only admin allow to use this
 * required: authenticateToken, user
 * see admin route on user for sample
 * update req.userPuid = string;
 * return code, body
 * 401, Access denied
 */
exports.adminSetPuid = (req, res, next) => {
  if (req.userData.role === Role.admin) {
    req.userPuid = req.params.puid;
  } else {
    return res.status(401).send("Access denied");
  }
  next();
};

/** set custom puid for profile as middleware
 * update req.userPuid = string;
 */
exports.publicSetPuid = (req, _res, next) => {
  req.userPuid = req.params.puid;
  next();
};
