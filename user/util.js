const jwt = require("jsonwebtoken");
const { Role } = require("./constant");

exports.generateRandomNumber = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

exports.createJwtToken = (payload) => {
  return jwt.sign(payload, process.env.LOGIN_JWT_SECRET, {
    expiresIn: process.env.LOGIN_JWT_EXPIRED_DAY,
  });
};

/** auth header
* headers: authorization: string, ie: jwt token without bearer
* return { puid: user.uid } from login
* error:
  - 401, Access denied
  - 403, Invalid token
  - 403, Token expired
*/
exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send("Token expired");
      } else {
        return res.status(403).send("Invalid token");
      }
    }
    req.user = user;
    next();
  });
};

/** set custom puid for profile as middleware
 * only admin allow to use this
 * required: authenticateToken, isMiddleWare, profile before use this
 * see admin route on user for sample
 */
exports.adminSetPuid = (req, res, next) => {
  if (req.userData.role === Role.admin) {
    req.user = {};
    req.user.puid = req.params.puid;
  } else {
    return res.status(401).send("Access denied");
  }
  next();
};
