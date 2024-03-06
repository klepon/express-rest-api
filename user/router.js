const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/pool.js");
const fatalError = require("../util/error.js");
const isMissingProperty = require("../util/propertyChecker.js");
require("dotenv").config();

// check envar for jwt token
if (process.env.LOGIN_JWT_SECRET.length < 512) {
  fatalError(
    "envar LOGIN_JWT_SECRET less than 512 char (" +
      process.env.LOGIN_JWT_SECRET.length +
      " char)",
    "Check your .env file and make sure envar LOGIN_JWT_SECRET has minimum 512 char"
  );
}

const router = express.Router();
const tableName = "users";

const generateRandomNumber = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber;
};

const debugError = (error) => {
  if (process.env.DEBUG_ERROR_REST_API) {
    console.error("=== error: ", error);
  }
};

const resError = (
  res,
  resCode,
  errorCode,
  errorSeverity,
  errorDetail,
  items = []
) => {
  res.status(resCode).json({
    error: {
      code: errorCode,
      severity: errorSeverity,
      detail: errorDetail,
      items: items,
    },
  });
};

const handleErrors = (error, res, resCode) => {
  debugError(error);
  const errorCode = error.code || 500;
  const errorSeverity = error.severity || "ERROR";
  const errorDetail = error.detail || "Internal Server Error";
  const errorItems = error.deatilItems || [];

  resError(res, resCode, errorCode, errorSeverity, errorDetail, errorItems);
};

const createJwtToken = (payload) =>
  jwt.sign(payload, process.env.LOGIN_JWT_SECRET, {
    expiresIn: process.env.LOGIN_JWT_EXPIRED_DAY,
  });

/* auth header
* headers: authorization: string, ie: jwt token without bearer
* return { puid: user.uid } from login
* error:
  - 401, Access denied
  - 403, Invalid token
  - 403, Token expired
*/
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.LOGIN_JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).send("Token expired");
      } else {
        return res.status(403).send("Invalid token");
      }
    }
    req.user = user;
    next();
  });
};

/* register
* body { display_name: string, email: string, username: string, password: string }
* return: User registered successfully
* error, response code 500
  "error": {
      "code": "23505",
      "severity": "ERROR",
      "detail": "Key (username)=(klep2) already exists."
      "detail": "Key (email)=(test+1@test.com) already exists."
  }
*/
router.post("/register", async (req, res, next) => {
  try {
    // check for missing property
    isMissingProperty(
      req.body,
      ["display_name", "email", "username", "password"],
      true
    );

    const { display_name, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO " +
      tableName +
      " (display_name, email, username, password, role, email_validation) VALUES ($1, $2, $3, $4, $5, $6)";
    await pool.query(query, [
      display_name,
      email,
      username,
      hashedPassword,
      "user",
      generateRandomNumber(),
    ]);
    res.status(201).send("User registered successfully");
  } catch (error) {
    handleErrors(error, res, 500);
  }
});

/* login
* body { username: string, password: string }
* return { token: string }
* error:
  - 401, Invalid user or password
  - 500, Internal Server Error
*/
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const query =
      "SELECT password, puid FROM " + tableName + " WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid user or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Invalid user or password");
    }

    const token = createJwtToken({ puid: user.puid });
    res.status(200).json({ token });
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
});

/* my profile
* auth header and response
* return {display_name: string, email: string, username: string, email_validation: number, is_blocked: string(f/t), role: string, avatar_id: number, bio: string, address: string, latlng: string, puid:string}
* error:
  - auth header error
  - 500, Internal Server Error
*/
router.get("/my-profile", authenticateToken, async (req, res) => {
  try {
    const query =
      "SELECT display_name, email, username, email_validation, is_blocked, role, avatar_id, bio, address, latlng, puid FROM " +
      tableName +
      " WHERE puid = $1";
    const result = await pool.query(query, [req.user.puid]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
});

/* update my profile
* auth header and response
* body {display_name: string, email: string, username: string, avatar_id: number, bio: string, address: string, latlng: string}
* return 1 sukkses, 0 fail
* error:
  - auth header error
  - 500, Internal Server Error
*/
router.post("/my-profile", authenticateToken, async (req, res) => {
  try {
    // check for missing property
    isMissingProperty(
      req.body,
      [
        "display_name",
        "email",
        "username",
        "avatar_id",
        "bio",
        "address",
        "latlng",
      ],
      true
    );

    const { display_name, email, username, avatar_id, bio, address, latlng } =
      req.body;

    // check if email change
    let query = "SELECT email FROM " + tableName + " WHERE puid = $1";
    let result = await pool.query(query, [req.user.puid]);
    const emailValidation =
      result.rows[0].email !== email
        ? ", email_validation=" + generateRandomNumber()
        : "";

    // make query
    query =
      "UPDATE " +
      tableName +
      " SET display_name = $1, email = $2, username = $3, avatar_id = $4, bio = $5, address = $6, latlng = $7" +
      emailValidation +
      " WHERE puid = $8 AND is_blocked = 'f'";
    const value = [
      display_name,
      email,
      username,
      parseInt(avatar_id) || null,
      bio || null,
      address || null,
      latlng || null,
      req.user.puid,
    ];
    result = await pool.query(query, value);
    res.status(200).json(result.rowCount);
  } catch (error) {
    handleErrors(error, res, 500);
  }
});

/* public profile
* params puid: string
* return { name: string}
* error:
  - 404, User not found
  - 500, Internal Server Error
*/
router.get("/profile/:puid", async (req, res) => {
  try {
    const query =
      "SELECT display_name, avatar_id, bio, address, latlng FROM " +
      tableName +
      " WHERE puid = $1 AND is_blocked = 'f'";
    const result = await pool.query(query, [req.params.puid]);
    if (result.rows.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
