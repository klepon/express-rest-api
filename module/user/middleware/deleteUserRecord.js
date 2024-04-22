/**
 * delete user record in table
 * - user
 * - history
 * - deletion schelude
 *
 * params:
 * integer uid
 */

const pool = require("../../../database/pool");
const { table } = require("../constant");

exports.deleteUserRecord = async (uid) => {
  try {
    await pool.query(`DELETE FROM ${table.user} WHERE uid = $1`, [uid]);
    await pool.query(`DELETE FROM ${table.history} WHERE uid = $1`, [uid]);
    await pool.query(`DELETE FROM ${table.schedule} WHERE uid = $1`, [uid]);
  } catch (error) {}
};
