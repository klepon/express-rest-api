/**
 * return sucess/fail status on create user flow done
 *
 * required:
 * integer req.resultDeleteUser
 *
 * response:
 * 200, string
 * 400, { "detail": default 400 message }
 */

const { throwError, debugErrorLine } = require("../../util/error");

exports.setPermissionToRole = async (req, res, next) => {
  // just placeholder, copied from register
  if (req.resultAssignRole && !req.resultDeleteUser) {
    res.status(200).send("User registered successfully");
  } else {
    debugErrorLine("register route")
    next(throwError(400))
  }
};
