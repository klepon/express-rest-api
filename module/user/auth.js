const jwt = require("jsonwebtoken");
const { throwError } = require("../../util/error");

exports.createJwtToken = (payload) => {
  return jwt.sign(payload, process.env.LOGIN_JWT_SECRET, {
    expiresIn: process.env.LOGIN_JWT_EXPIRED_DAY,
  });
};

/** auth header
* headers: authorization: string, ie: jwt token without bearer
* update req.userPuid: string
* error:
  - 401, Access denied
  - 403, Invalid token
  - 403, Token expired
*/
exports.authToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) throwError(401, authToken); // return res.status(401).send("Access denied");
  console.log("===== trhownya lwat");

  jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        throwError(403, authToken); //return res.status(403).send("Token expired");
      } else {
        throwError(403, authToken); //return res.status(403).send("Invalid token");
      }
    }
    req.userPuid = data.puid;
    next();
  });
};
