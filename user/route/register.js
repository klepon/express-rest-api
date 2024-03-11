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

exports.register = async (req, res, next) => {
  if (req.resultAssignRole && !req.resultDeleteUser) {
    res.status(200).send("User registered successfully");
  } else {
    debugErrorLine("register route")
    next(throwError(400))
  }
};
