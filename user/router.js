const express = require("express");
const { register } = require("./route/register.js");
const { login } = require("./route/login.js");
const { profile } = require("./route/profile.js");
const { publicProfile } = require("./route/publicProfile.js");
const { update } = require("./route/update.js");
const { remove } = require("./route/remove.js");
const { verifyEmail } = require("./route/verifyEmail.js");
const { sendEmailVerificationCode } = require("./route/sendEmailVerificationCode.js");
const { adminProfile } = require("./route/adminProfile.js");
const { adminUpdate } = require("./route/adminUpdate.js");
const { publicSetPuid, adminSetPuid } = require("./middleware/puid.js");
const { user } = require("./middleware/user.js");
const { authToken } = require("./middleware/auth.js");
const { fatalError } = require("../util/error.js");
const { adminRemove } = require("./route/adminRemove.js");

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
router.post("/profile", authToken, user, update);
router.post("/delete", authToken, user, remove);
router.post("/validate-email", authToken, verifyEmail)
router.get("/profile", authToken, user, profile);
router.get("/request-email-verification-code", authToken, user, sendEmailVerificationCode)

// admin route
router.post("/admin/update/:puid", authToken, user, adminSetPuid, adminUpdate)
router.get("/admin/profile/:puid", authToken, user, adminSetPuid, user, adminProfile);
router.get("/admin/delete/:puid", authToken, user, adminSetPuid, user, adminRemove);

// public route
router.get("/profile/:puid", publicSetPuid, user, publicProfile);

module.exports = router;
