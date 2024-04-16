const jwt = require("jsonwebtoken");
const { throwError } = require("../../util/error");

exports.createJwtToken = (payload) => {
  return jwt.sign(payload, process.env.LOGIN_JWT_SECRET, {
    expiresIn: process.env.LOGIN_JWT_EXPIRED_DAY,
  });
};

/** auth header
* headers: authorization: string, ie: jwt token without bearer
* passing req.userAuthPuid: string
* error:
  - 401, Access denied
  - 403, Invalid token
  - 403, Token expired
*/
exports.authToken = (req, _res, next) => {
  const token = req.headers["authorization"];
  if (!token) throwError(401, "AuthToken missing");

  jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        throwError(403, "AuthToken expired");
      } else {
        throwError(403, "AuthToken invalid");
      }
    }
    req.userAuthPuid = data.puid;
    next();
  });
};
