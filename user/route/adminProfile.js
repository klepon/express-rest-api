/* profile request by admin 
* GET
* params puid: string
* return code, body
* 200, {
    "display_name": string
    "email": string
    "username": string
    "email_validation": number, 1 === valid
    "is_blocked": boolean
    "role": string
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
    "puid": string
    "email": string
    "username": string
    "is_blocked": string
    "role": string
  }
* get profile error response
*/

const { debugError } = require("../../util/error.js");
const { filterObject } = require("../../util/filterObject.js");
const { Role } = require("../constant.js");

exports.adminProfile = async (req, res, _next) => {
  try {
    if (req.userData) {
      const privateData = [
        "display_name",
        "email",
        "username",
        "email_validation",
        "is_blocked",
        "role",
        "avatar_id",
        "bio",
        "address",
        "latlng",
        "puid",
        "email",
        "username",
        "is_blocked",
        "role",
      ];
      res.status(200).json(filterObject(req.userData, privateData));
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminSetPuid = (req, res, next) => {
  if (req.userData.role === Role.admin) {
    req.user = {};
    req.user.puid = req.params.puid;
  } else {
    return res.status(401).send("Access denied");
  }
  next();
};
