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

const { throwError } = require("../../util/error");

exports.registerResponse = async (req, res, next) => {
  if (req.resultAssignRole && !req.resultDeleteUser) {
    res.status(200).send("User registered successfully");
  } else {
    throwError(400)
  }
};
