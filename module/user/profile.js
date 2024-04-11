/** 
 * return my profile data
 * 
 * required:
 * req.userAuthData
 * 
 * response
 * 200
 * {
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
  }
 * response:
 * 403
*/

const { throwError } = require("../../util/error");
const { filterObject } = require("../../util/filterObject");

exports.profile = async (req, res, next) => {
  try {
    if (req.userAuthData.is_blocked) {
      throwError(403, "Profile blocked");
    }

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
      "created_at",
      "timezone",
    ];
    res.status(200).json(filterObject(req.userAuthData, privateData));
  } catch (error) {
    next(error);
  }
};
