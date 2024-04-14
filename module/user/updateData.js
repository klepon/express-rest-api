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
 * array req.reqInputProps
 * array optionalInputProps
 */

exports.updateData = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.reqInputProps = [
    "display_name",
    "email",
    "username",
    "avatar_id",
    "bio",
    "address",
    "latlng",
    "timezone",
  ];

  req.optionalInputProps = ["avatar_id", "bio", "address", "latlng"];
  next();
};
