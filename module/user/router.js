const express = require("express");
const { registerData } = require("./input/registerData");
const { inputValidation } = require("../../util/inputValidation");
const { createUser } = require("./middleware/createUser");
const { loginData } = require("./input/loginData");
const { login } = require("./middleware/login");
const { authToken } = require("./middleware/auth");
const { readUser } = require("./middleware/readUser");
const { profile } = require("./middleware/profile");
const { updateUser } = require("./middleware/updateUser");
const { updateData } = require("./input/updateData");
const { sendEmailVerificationCode } = require("./middleware/sendEmailVerificationCode");
const { userOnFinish } = require("./middleware/userOnFinish");
const { verifyEmailData } = require("./input/verifyEmailData");
const { verifyEmail } = require("./middleware/verifyEmail");
const { removeUser } = require("./middleware/removeUser");
const { fatalError } = require("../../util/error");
const { userPath } = require("./constant");

// check envar for jwt token
if (process.env.LOGIN_JWT_SECRET.length < 512) {
  fatalError(
    "envar LOGIN_JWT_SECRET less than 512 char (" +
      process.env.LOGIN_JWT_SECRET.length +
      " char)",
    "Check your .env file and make sure envar LOGIN_JWT_SECRET has minimum 512 char"
  );
}

const onFinish = express.Router();
onFinish.use(userOnFinish);
// todo update history, on update and on delete, on validate email??

const router = express.Router();
router.post(userPath.register, registerData, inputValidation, createUser);
router.post(userPath.login, loginData, inputValidation, login);
router.get(userPath.profile, authToken, readUser, profile);
router.delete(userPath.profile, authToken, removeUser);
router.patch(
  userPath.profile,
  updateData,
  inputValidation,
  authToken,
  readUser,
  updateUser
);
router.get(
  userPath.requestEmailVerificationCode,
  authToken,
  readUser,
  sendEmailVerificationCode
);
router.patch(
  userPath.verifyEmail,
  verifyEmailData,
  inputValidation,
  authToken,
  readUser,
  verifyEmail
);

exports.userRoutes = router;
exports.userOnFinish = onFinish;
