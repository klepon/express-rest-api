exports.tableRole = "role";
exports.tablePermission = "permission";
exports.tableRolePermission = "role_permission";
exports.roles = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};
exports.permissions = {
  superAdmin: "*",
  userAdmin: "USER:ADMIN",
  userMe: "USER:{ME}",
  userFriend: "USER:{FRIEND}",
  userGroup: "USER:{GROUP}",
};
