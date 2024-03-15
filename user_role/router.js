const express = require("express");
const { authToken } = require("./middleware/auth");
const { getUser } = require("./middleware/userRead");
const { createRole } = require("./route/roleCreate");
const { inputRegister } = require("./middleware/inputRegister");
const { inputLogin } = require("./middleware/inputLogin");
const { inputValidation } = require("../util/inputValidation");
const { createUser } = require("./middleware/userCreate");
const { setRole } = require("./middleware/setRole");
const { assignRole } = require("./middleware/roleAssignToUser");
const { removeUser } = require("./middleware/userDelete");
const { login } = require("./route/userLogin");
const { register } = require("./route/userRegister");

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
router.post(
  "/register",
  inputRegister,
  inputValidation,
  createUser,
  setRole,
  assignRole,
  removeUser,
  register
);
router.post("/login", inputLogin, inputValidation, login);
// router.get("/profile", authToken, getUser, profile);
// router.post("/profile", authToken, getUser, update);
// router.post("/delete", authToken, getUser, remove);
// router.post("/validate-email", authToken, verifyEmail)
// router.get("/request-email-verification-code", authToken, getUser, sendEmailVerificationCode)

// admin route
router.post("/role/create", authToken, getUser, createRole);
// router.post("/admin/update/:puid", authToken, getUser, adminSetPuid, adminUpdate)
// router.get("/admin/profile/:puid", authToken, getUser, adminSetPuid, getUser, adminProfile);
// router.get("/admin/delete/:puid", authToken, getUser, adminSetPuid, getUser, adminRemove);

// public route
// router.get("/profile/:puid", publicSetPuid, getUser, publicProfile);

module.exports = router;
