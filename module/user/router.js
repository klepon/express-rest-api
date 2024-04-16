const express = require("express");
const { registerData } = require("./registerData");
const { inputValidation } = require("../../util/inputValidation");
const { createUser } = require("./createUser");
const { loginData } = require("./loginData");
const { login } = require("./login");
const { authToken } = require("./auth");
const { readUser } = require("./readUser");
const { profile } = require("./profile");
const { updateUser } = require("./updateUser");
const { updateData } = require("./updateData");
const { sendEmailVerificationCode } = require("./sendEmailVerificationCode");
const { userOnFinish } = require("./userOnFinish");
const { verifyEmailData } = require("./verifyEmailData");
const { verifyEmail } = require("./verifyEmail");
const { removeUser } = require("./removeUser");
const { fatalError } = require("../../util/error");

// check envar for jwt token
if (process.env.LOGIN_JWT_SECRET.length < 512) {
  fatalError(
    "envar LOGIN_JWT_SECRET less than 512 char (" +
      process.env.LOGIN_JWT_SECRET.length +
      " char)",
    "Check your .env file and make sure envar LOGIN_JWT_SECRET has minimum 512 char"
  );
}

exports.userPath = {
  main: "/user",
  register: "/register",
  login: "/login",
  profile: "/profile",
  requestEmailVerificationCode: "/request-email-verification-code",
  verifyEmail: "/verify-email",
};

const onFinish = express.Router();
onFinish.use(userOnFinish);
// todo update history, on update and on delete, on validate email??

const router = express.Router();
router.post(this.userPath.register, registerData, inputValidation, createUser);
router.post(this.userPath.login, loginData, inputValidation, login);
router.get(this.userPath.profile, authToken, readUser, profile);
router.delete(this.userPath.profile, authToken, removeUser);
router.patch(
  this.userPath.profile,
  updateData,
  inputValidation,
  authToken,
  readUser,
  updateUser
);
router.get(
  this.userPath.requestEmailVerificationCode,
  authToken,
  readUser,
  sendEmailVerificationCode
);
router.patch(
  this.userPath.verifyEmail,
  verifyEmailData,
  inputValidation,
  authToken,
  readUser,
  verifyEmail
);

exports.userRoutes = router;
exports.userOnFinish = onFinish;
