const { throwErrorMessage } = require("../util/error");

// const generatePermission = (data) => {
//   return data.map((role) => {
//     const roles = [];
//     ["c", "r", "u", "d"].forEach((key) => {
//       roles.push(role[key] ? 1 : 0);
//     });
//     return `${roles.join("")}:${role.permission}`;
//   });
// };

/**
 * check user permission
 * throw 401, Unauthorized
 * @param array user
 * [c-u-:post:uuid1, c-u-:post:uuid2, c-d-:post:*], * match all uuid
 * @param string permission
 * service permissionie: --u-:post:uuid, current any public id using uuid-v4
 */
exports.checkPermission = (user, permission) => {
  if (!user || user.lenth === 0) throwErrorMessage(401);
  if (user.includes("crud:*")) return;

  const hasPermission = user.find((u) => {
    const pattern = u
      .replace(/-/g, ".")
      .replace(
        /\*/g,
        "(\\*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})"
      );
    const regex = new RegExp(pattern);
    return regex.test(permission);
  });

  if (!hasPermission) throwErrorMessage(401);
};
