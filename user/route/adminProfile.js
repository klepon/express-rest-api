/** profile request by admin 
* use: auth, user, adminPuid, user
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
  }
*/

const { debugError } = require("../../util/error.js");
const { filterObject } = require("../../util/filterObject.js");
const { authToken } = require("../middleware/auth.js");
const { adminSetPuid } = require("../middleware/puid.js");
const { user } = require("../middleware/user.js");

exports.adminProfile = async (req, res, _next) => {
  try { // get admin puid
    authToken(req, res, () => { // get admin user data
      user(req, res, () => { // if has permision, update puid with param.puid, else return permission denied
        adminSetPuid(req, res, () => {
          user(req, res, () => { // return user data base on permission
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
          });
        });
      });
    });
  } catch (error) {
    debugError(error);
    res.status(500).send("Internal Server Error");
  }
};
