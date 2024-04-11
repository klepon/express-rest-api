const express = require("express");
const { registerData } = require("./registerData");
const { inputValidation } = require("../../util/inputValidation");
const { createUser } = require("./createUser");

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

module.exports = userRouter;
