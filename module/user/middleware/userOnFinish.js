/** handle on user route finish
 *
 * required:
 * string req.onFinish
 * object req.cleanData
 */

const { onFinishUser } = require("../constant.js");
const { sendEmailVerificationCode } = require("./sendEmailVerificationCode.js");

exports.userOnFinish = async (req, res, next) => {
  res.on("finish", () => {
    if (req.onFinish === onFinishUser.emailUpdated) {
      sendEmailVerificationCode(req, res, next);
      return;
    }
  });
  next();
};
