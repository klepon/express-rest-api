/** public profile
* use: publicPuid, user
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
*/

const { debugError } = require("../util/error.js");
const { filterObject } = require("../util/filterObject.js");

exports.publicProfile = async (req, res, _next) => {
  try {
    if (req.userData && !req.userData.is_blocked) {
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

