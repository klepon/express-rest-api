/* public profile
* use: profile
* GET
* params puid: string
* return code, body
* 200, {
    "display_name": string
    "avatar_id": number | null
    "bio": string | null
    "address": string | null
    "latlng": string | null
  }
* get profile error response
*/

const { debugError } = require("../../util/error.js");
const { filterObject } = require("../../util/filterObject.js");

exports.publicProfile = async (req, res, _next) => {
  try {
    if (req.userData) {
      const privateData = [
        "display_name",
        "avatar_id",
        "bio",
        "address",
        "latlng",
        "puid",
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

/** set custom puid for profile as middleware */
exports.publicSetPuid = (req, _res, next) => {
  req.user = {}
  req.user.puid = req.params.puid;
  next();
};
