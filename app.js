require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const { debugError, newError } = require("./util/error.js");
const {
  userTable,
  userHistoryTable,
  userDeletionSchedule,
} = require("./module/user/table.js");
const {
  userOnFinish,
  userRoutes,
} = require("./module/user/router.js");
const { userPath } = require("./module/user/constant.js");

const app = express();
const PORT = process.env.PORT || 3000;
global.isMainProcess = require.main === module;

app.use(bodyParser.json());

// onFinish route middleware
app.use(userOnFinish);

// route
app.use(userPath.main, userRoutes);

// handle error route
app.use((_req, res, _next) => {
  res.status(404).send("Route not found");
});

// handle error response
app.use((error, _req, res, _next) => {
  if (!error.service) {
    error.service = "App catch error";
    debugError(error);
  }

  const code = error.resCode || 500;
  const responseError = error.resCode ? error : newError(code, null, error);
  delete responseError.resCode;
  res.status(code).json(responseError);
});

cron.schedule("0 1 * * *", () => {
  // todo delete user in schedule
  console.log("check table cron job");
});

if (isMainProcess) {
  // create table
  (async () => {
    await userHistoryTable();
    await userDeletionSchedule();
    await userTable();
  })();

  app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}`);
  });
} else {
  process.env.DEBUG_ERROR_REST_API = "false";
}

module.exports = app;
