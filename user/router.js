const express = require("express");
const fatalError = require("../util/error.js");
const { register } = require("./route/register.js");
const { login } = require("./route/login.js");
const { profile } = require("./route/profile.js");
const { authenticateToken } = require("./util.js");
const { update } = require("./route/update.js");
const { publicProfile } = require("./route/publicProfile.js");
const { remove } = require("./route/remove.js");
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
router.get("/my-profile", authenticateToken, profile);
router.post("/my-profile", authenticateToken, update);
router.get("/profile/:puid", publicProfile);
router.post("/delete", authenticateToken, remove);

module.exports = router;
