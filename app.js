require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user/router.js");
const { createTableRole } = require("./role/database/role.js");
const { removeMediaOnDeleteUser } = require("./mediaUploader/onDeleteUser.js");
const { createTableUser } = require("./user/database/user.js");
const { setErrorCode, debugError } = require("./util/error.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// response route middleware
app.use(removeMediaOnDeleteUser);

// route
app.use("/user", userRouter);

// create table
(async () => {
  await createTableRole();
  await createTableUser();
  console.log(
    `===== table setup done\nREST API ready to use on port ${PORT}\n`
  );
})();

// handle error
app.use((error, _req, res, _next) => {
  debugError(error, "App: handle error", true);
  const code = error.resCode || error.statusCode || 500;
  const err = error.resCode
    ? error
    : setErrorCode(error.statusCode || 500, error);
  delete err.resCode;
  res.status(code).json(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
