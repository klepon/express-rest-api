/** my profile
* use: auth, user
* GET
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
  }
* 500, Internal Server Error
*/

const { debugError } = require("../../util/error.js");
const { filterObject } = require("../../util/filterObject.js");

exports.profile = async (req, res, next) => {
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
      ];
      res.status(200).json(filterObject(req.userData, privateData));
    }
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
