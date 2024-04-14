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
const { userOnFinish, userRoutes } = require("./module/user/router.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// onFinish route middleware
app.use(userOnFinish);

// route
app.use("/user", userRoutes);

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
  const responseError = error.resCode
    ? error
    : newError(code, "Handle error", error);
  delete responseError.resCode;
  res.status(code).json(responseError);
});

cron.schedule("0 1 * * *", () => {
  console.log("check table cron job");
});

// create table
(async () => {
  await userHistoryTable();
  await userDeletionSchedule();
  await userTable();
})();

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
});
