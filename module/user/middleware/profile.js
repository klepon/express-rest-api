/** 
 * return my profile data
 * 
 * required:
 * req.userAuthData
 * 
 * response
 * 200
 * {
    "puid": string
    "display_name": string
    "email": string
    "username": string
    "email_validation": number, 1 === valid
    "is_blocked": boolean
    "in_delete_schedule": boolean
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
    "timezone": string
    "created_at": timestamp
    "update_at": timestamp
  }
*/

const { throwError } = require("../../../util/error");
const { filterObject } = require("../../../util/filterObject");

exports.profile = async (req, res, next) => {
  try {
    if (req.userAuthData.is_blocked) {
      throwError(403, "Profile blocked");
    }

    const privateData = [
      "puid",
      "display_name",
      "email",
      "username",
      "email_validation",
      "is_blocked",
      "in_delete_schedule",
      "avatar_id",
      "bio",
      "address",
      "latlng",
      "timezone",
      "created_at",
      "update_at",
      "timezone",
    ];

    // for use in mocha test 
    if (!isMainProcess) {
      privateData.push("uid");
    }
    res.status(200).json(filterObject(req.userAuthData, privateData));
  } catch (error) {
    next(error);
  }
};
