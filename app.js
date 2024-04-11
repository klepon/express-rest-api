require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// const { removeMediaOnDeleteUser } = require("./mediaUploader/onDeleteUser.js");
const userRouter = require("./module/user/router.js");

const { userTable } = require("./module/user/userTable.js");

const { debugError, newError } = require("./util/error.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// response route middleware
// app.use(removeMediaOnDeleteUser);

// route
app.use("/user", userRouter);

// handle error route
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// create table
(async () => {
  await userTable();
})();

// handle error
app.use((error, _req, res, _next) => {
  const errorFrom = error;
  if (!error.from) {
    errorFrom.from = "Handle error";
  }
  debugError(error.from ? error : errorFrom);

  const code = error.resCode || 500;
  const responseError = error.resCode
    ? error
    : newError(code, "Handle error", error);
  delete responseError.resCode;
  delete responseError.from;
  res.status(code).json(responseError);
});

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});
