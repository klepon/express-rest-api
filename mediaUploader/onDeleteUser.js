const { handleErrors } = require("../util/error");

exports.removeMediaOnDeleteUser = async (req, res, next) => {
  res.on('finish', () => {
    try {
      if(req.method === "POST" && req.url === "/delete" && req.deletedUid) {
        console.log("======== remove media for uid: ", req.deletedUid)

        // todo: delete media here
      }
    } catch(error) {
      handleErrors(error, res, 500)
    }
  });
  next();
}