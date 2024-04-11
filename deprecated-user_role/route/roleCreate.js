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
const { table } = require("../constant.js");

exports.createRole = async (req, res, _next) => {
  try {
    const query = `INSERT INTO ${table.role} (name) VALUES ($1)`;
    const result = await pool.query(query, [req.roleData.name]);
    res.status(200).send(result.rowCount);
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
