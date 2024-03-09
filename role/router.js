const express = require("express");
const { createRole } = require("./route/createRole");
const { getUser } = require("../user/middleware/user");
const { authToken } = require("../user/middleware/auth");

const router = express.Router();

router.post("/role/create", authToken, getUser, createRole)

module.exports = router;
