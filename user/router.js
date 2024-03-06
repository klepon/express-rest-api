const express = require("express");
const fatalError = require("../util/error.js");
const { register } = require("./route/register.js");
const { login } = require("./route/login.js");
const { myProfile } = require("./route/myProfile.js");
const { authenticateToken } = require("./util.js");
const { updateProfile } = require("./route/updateProfile.js");
const { publicProfile } = require("./route/publicProfile.js");
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
router.post("/register", register);
router.post("/login", login);
router.get("/my-profile", authenticateToken, myProfile);
router.post("/my-profile", authenticateToken, updateProfile)
router.get("/profile/:puid", publicProfile)

module.exports = router;
