const express = require("express");
const fatalError = require("../util/error.js");
const { register } = require("./route/register.js");
const { login } = require("./route/login.js");
const { profile } = require("./route/profile.js");
const { authenticateToken } = require("./util.js");
const { update } = require("./route/update.js");
const { publicProfile, publicSetPuid } = require("./route/publicProfile.js");
const { remove } = require("./route/remove.js");
const { verifyEmail } = require("./route/verifyEmail.js");
const { sendEmailVerificationCode } = require("./route/sendEmailVerificationCode.js");
const { isMiddleWare } = require("../util/middleware.js");
const { adminSetPuid, adminProfile } = require("./route/adminProfile.js");
require("dotenv").config();

// check envar for jwt token
if (process.env.LOGIN_JWT_SECRET.length < 512) {
  fatalError(
    "envar LOGIN_JWT_SECRET less than 512 char (" +
      process.env.LOGIN_JWT_SECRET.length +
      " char)",
    "Check your .env file and make sure envar LOGIN_JWT_SECRET has minimum 512 char"
  );
}

const router = express.Router();

// private route
router.post("/register", register);
router.post("/login", login);
router.post("/my-profile", authenticateToken, update);
router.post("/delete", authenticateToken, remove);
router.post("/validate-email", authenticateToken, verifyEmail)
router.get("/my-profile", authenticateToken, profile);
router.get("/request-email-verification-code", authenticateToken, isMiddleWare, profile, sendEmailVerificationCode)

// admin route
router.get("/admin/profile/:puid", authenticateToken, isMiddleWare, profile, adminSetPuid,  profile, adminProfile);

// public route
router.get("/profile/:puid", isMiddleWare, publicSetPuid, profile, publicProfile);

module.exports = router;
