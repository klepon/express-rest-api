require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user_role/router.js");
const { removeMediaOnDeleteUser } = require("./mediaUploader/onDeleteUser.js");
const { setErrorCode, debugError } = require("./util/error.js");
const { createTableRole } = require("./user_role/database/role.js");
const { createTableUser } = require("./user_role/database/user.js");

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
