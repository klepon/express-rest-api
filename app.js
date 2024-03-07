const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user/router.js");
const { createTableUser } = require("./user/database.js");
const { removeMediaOnDeleteUser } = require("./mediaUploader/onDeleteUser.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// response route middleware
app.use(removeMediaOnDeleteUser)

// route
app.use('/user', userRouter);

// create table
(async () => {
  await createTableUser();
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
