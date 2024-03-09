/**
 * create role, see input validation for body value
 * POST
 * permission: c---:ROLE
 * body: { name: string }
 * return code, body
 * 200, 1 success, 0 fail
 * 500, Internal Server Error
 */

const pool = require("../../database/pool.js");
const { debugError } = require("../../util/error.js");
const { propertyChecker } = require("../../util/propertyChecker.js");
const { tableRole } = require("../constant.js");
const { checkPermission } = require("../getPermission.js");

exports.createRole = async (req, res, _next) => {
  try {
    checkPermission(req.userData.permission, "c---:ROLE", res);
    propertyChecker(req.roleData, ["name"]);

    const query = `INSERT INTO ${tableRole} (name) VALUES ($1)`;
    const result = await pool.query(query, [req.roleData.name]);
    res.status(200).send(result.rowCount);
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
