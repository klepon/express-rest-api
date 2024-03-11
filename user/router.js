const express = require("express");
const { fatalError } = require("../util/error.js");
const { inputRegister } = require("./middleware/inputRegister.js");
const { inputValidation } = require("../util/inputValidation.js");
const { createUser } = require("./middleware/uCreate.js");
const { removeUser } = require("./middleware/uDelete.js");
const { assignRole } = require("../role/middleware/assignRole.js");
const { setRole } = require("./middleware/setRole.js");
const { register } = require("./route/register.js");
const { inputLogin } = require("./middleware/inputLogin.js");
const { login } = require("./route/login.js");

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
router.post("/register", inputRegister, inputValidation, createUser, setRole, assignRole, removeUser, register);
router.post("/login", inputLogin, inputValidation, login);
// router.get("/profile", authToken, getUser, profile);
// router.post("/profile", authToken, getUser, update);
// router.post("/delete", authToken, getUser, remove);
// router.post("/validate-email", authToken, verifyEmail)
// router.get("/request-email-verification-code", authToken, getUser, sendEmailVerificationCode)

// admin route
// router.post("/admin/update/:puid", authToken, getUser, adminSetPuid, adminUpdate)
// router.get("/admin/profile/:puid", authToken, getUser, adminSetPuid, getUser, adminProfile);
// router.get("/admin/delete/:puid", authToken, getUser, adminSetPuid, getUser, adminRemove);

// public route
// router.get("/profile/:puid", publicSetPuid, getUser, publicProfile);

module.exports = router;
