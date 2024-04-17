/** 
 * required input properties for update user
 * 
 * POST
 * body { 
    display_name: "string",
    email: "string",
    username: "string",
    avatar_id: "string",
    bio: "string",
    address: "string",
    latlng: "string",
    timezone: "string",
 }
 * passing:
 * object req.inputToValidate
 * array req.optionalInputProps
 */

exports.updateData = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.optionalInputProps = [
    "display_name",
    "email",
    "username",
    "avatar_id",
    "bio",
    "address",
    "latlng",
    "timezone",
  ];
  next();
};
