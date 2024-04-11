const express = require("express");
const { registerData } = require("./registerData");
const { inputValidation } = require("../../util/inputValidation");
const { createUser } = require("./createUser");
const { loginData } = require("./loginData");
const { login } = require("./login");
const { authToken } = require("./auth");
const { readUser } = require("./readUser");
const { profile } = require("./profile");

// check envar for jwt token
if (process.env.LOGIN_JWT_SECRET.length < 512) {
  fatalError(
    "envar LOGIN_JWT_SECRET less than 512 char (" +
      process.env.LOGIN_JWT_SECRET.length +
      " char)",
    "Check your .env file and make sure envar LOGIN_JWT_SECRET has minimum 512 char"
  );
}

const userRouter = express.Router();

// private route
userRouter.post("/register", registerData, inputValidation, createUser);
userRouter.post("/login", loginData, inputValidation, login)
userRouter.get("/profile", authToken, readUser, profile);

module.exports = userRouter;
