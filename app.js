const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./user/router.js");
const { createTable: createTableUser } = require("./user/database.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/register", userRouter);
app.post("/login", userRouter);
app.get("/my-profile", userRouter);
app.post("/my-profile", userRouter);
app.get("/profile/:puid", userRouter);

(async () => {
  await createTableUser();
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
