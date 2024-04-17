/** remove my profile after 28 days via cron job
 *
 * required
 * uuid v4 req.userAuthPuid
 *
 * passing:
 * date req.updateAt
 * string req.onFinish
 *
 * response
 * 200 success
 * 400, Fail deleting user
 */

const pool = require("../../../database/pool");
const { throwError } = require("../../../util/error");
const { table, onFinishUser } = require("../constant");

exports.removeUser = async (req, res, next) => {
  try {
    req.updateAt = new Date();
    const deleteSchedule = new Date(req.updateAt.getTime());
    deleteSchedule.setTime(deleteSchedule.getTime() + 28 * 24 * 60 * 60 * 1000);

    const updateQuery = `UPDATE ${table.user} SET in_delete_schedule = 't', update_at = $2 WHERE puid = $1 AND is_blocked = 'f' AND in_delete_schedule = 'f'`;
    const schedueQuery = `INSERT INTO ${table.schedule} (puid, delete_on) VALUES ($1, $2)`;

    await pool.query("BEGIN");

    const schedule = await pool.query(schedueQuery, [
      req.userAuthPuid,
      deleteSchedule,
    ]);

    if (schedule.rowCount === 0) {
      throwError(400, "Remove user", "Fail scheduling delete user");
    }

    const update = await pool.query(updateQuery, [
      req.userAuthPuid,
      req.updateAt,
    ]);

    if (update.rowCount === 0) {
      throwError(400, "Remove user", "Fail deleting user");
    }

    await pool.query("COMMIT");

    req.onFinish = onFinishUser.deleted;
    res.status(200).send("User will be deleted in 28 days");
  } catch (error) {
    await pool.query("ROLLBACK");
    next(error);
  }
};
