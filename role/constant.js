exports.tableRole = "role";
exports.tablePermission = "permission";
exports.tableRolePermission = "role_permission";
exports.roles = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};
/**
 * "*" pass all permission
 */
exports.permissions = {
  superAdmin: "*",
  userAdmin: "USER:*",
  userMe: "USER:{ME}",
  userFriend: "USER:{FRIEND}",
  userGroup: "USER:{GROUP}",
};
