/**
 * remove user
 *
 * required:
 * object req.body: { uid: integer, puid: uuid-v4 }
 * or
 * when fail in chain register, asign role
 * will not update req[deletedUid] for use in on finish
 * object req.body, contain username: string
 * object req.resultAssignRole: 1 ignored, 0 delete
 *
 * response:
 * integer req[deletedUid]
 * integer req.resultDeleteUser, 1 success, 0 fail
 * next()
 * 500, { "detail": default 500 message }
 */

const pool = require("../../database/pool.js");
const { deletedUid } = require("../../util/constant.js");
const { debugError } = require("../../util/error.js");
const { tableUser } = require("../constant.js");

exports.removeUser = async (req, res, next) => {
  try {
    const result = await pool.query(
      `DELETE FROM ${tableUser} WHERE (uid = $1 AND puid = $2) OR username = $3`,
      [req.body.uid, req.body.puid, !req.resultAssignRole && req.body.username]
    );

    if (result.rowCount && !req.body.username) req[deletedUid] = req.body.uid;
    next();
  } catch (error) {
    debugError(error, "User: removeUser catch block");
    next(error);
  }
};
