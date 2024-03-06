const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user/router.js");
const { createTable: createTableUser } = require("./user/database.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/user', userRouter);

(async () => {
  await createTableUser();
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
