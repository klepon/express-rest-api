/**
 * create history user record
 *
 * required:
 * object req.cleanData
 * object req.userAuthData
 */

const pool = require("../../../database/pool");
const { table } = require("../constant");

exports.userHistory = async (req) => {
  if (!req.cleanData || !req.userAuthData) return;

  try {
    const updatedData = Object.keys(req.cleanData)
      .filter(
        (key) =>
          req.cleanData[key] != req.userAuthData[key] &&
          !["update_at", "email_validation"].includes(key)
      )
      .map((key) => [
        req.userAuthData.uid,
        req.cleanData["update_at"],
        key,
        req.userAuthData[key],
        req.cleanData[key],
      ]);

    for (item of updatedData) {
      const query = `INSERT INTO ${table.history} (uid,
        update_at,
        key,
        before,
        after) VALUES ($1, $2, $3, $4, $5)`;
      await pool.query(query, item);
    }
  } catch (error) {}
};
