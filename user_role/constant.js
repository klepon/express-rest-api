exports.table = {
  role: "role",
  permission: "permission",
  rolePermission: "role_permission",
  user: "users",
  userRole: "user_role",
};

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
