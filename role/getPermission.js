const pool = require("../database/pool.js");
const { debugError } = require("../util/error.js");
const { tableRole, tablePermission } = require("./constant.js");

// const generatePermission = (data) => {
//   return data.map((role) => {
//     const roles = [];
//     ["c", "r", "u", "d"].forEach((key) => {
//       roles.push(role[key] ? 1 : 0);
//     });
//     return `${roles.join("")}:${role.permission}`;
//   });
// };

exports.getRoleID = async (roleNames) => {
  try {
    return await pool.query(
      `SELECT rid FROM ${tableRole} WHERE name = ANY($1)`,
      [roleNames]
    );
  } catch (e) {
    debugError(e);
    return [];
  }
};

exports.getPermissionIDs = async (permissionNames) => {
  try {
    return await pool.query(
      `SELECT pid FROM ${tablePermission} WHERE permission = ANY($1)`,
      [permissionNames]
    );
  } catch (e) {
    debugError(e);
    return [];
  }
};

/**
 * check user permission, resturn res or continue
 * @param {*} user
 * [c-d-:post:fuid1, c-d-:post:fui2] or any id provide by caller
 * @param {*} permission
 * service permissionie: -r--:post:fuid
 * @param {*} res
 * from express
 */
exports.checkPermission = (user, permission, res) => {
  if (user.includes("crud:*")) return;

  const part2 = permission.substring(4);
  const userPermission = user.find((u) => u.substring(4) === part2) || "----:";

  const pattern = permission.substring(0, 4);
  const regexPattern = pattern.replace(/-/g, ".");
  const regex = new RegExp(regexPattern);
  if (!regex.test(userPermission.substring(0, 4))) {
    res.status(401).send("Access denied");
  }
};
