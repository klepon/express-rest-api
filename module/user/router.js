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

const onFinish = express.Router();
onFinish.use(userOnFinish);
// todo update history, on update and on delete, on validate email??

const router = express.Router();
router.post("/register", registerData, inputValidation, createUser);
router.post("/login", loginData, inputValidation, login);
router.get("/profile", authToken, readUser, profile);
router.delete("/profile", authToken, removeUser)
router.patch(
  "/profile",
  updateData,
  inputValidation,
  authToken,
  readUser,
  updateUser
);
router.get(
  "/request-email-verification-code",
  authToken,
  readUser,
  sendEmailVerificationCode
);
router.patch(
  "/verify-email",
  verifyEmailData,
  inputValidation,
  authToken,
  readUser,
  verifyEmail
);

exports.userRoutes = router;
exports.userOnFinish = onFinish;
