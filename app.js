require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// const { removeMediaOnDeleteUser } = require("./mediaUploader/onDeleteUser.js");
const userRouter = require("./module/user/router.js");

const { userTable } = require("./module/user/userTable.js");

const { debugError, throwError } = require("./util/error.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// response route middleware
// app.use(removeMediaOnDeleteUser);

// route
app.use("/user", userRouter);

// create table
(async () => {
  await userTable();
  console.log(`\n`);
})();

// handle error
app.use((error, _req, res, _next) => {
  const responseError = error.code ? error : throwError(500, "handle error", error)
  debugError(responseError);
  res.status(code).json(responseError);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
