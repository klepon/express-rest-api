/** send email verification code
 * useL auth, user
 * GET
 * return code, body
 * 200, masked email, ang*********@gmail.com
 * 401, {
    "code": "EAUTH",
    "response": "534-5.7.9 Application-specific password required. For more information, go to\n534 5.7.9  https://support.google.com/mail/?p=InvalidSecondFactor g24-20020a170902869800b001dbae7b85b1sm14176175plo.237 - gsmtp",
    "responseCode": 534,
    "command": "AUTH PLAIN"
  }
 */

const { handleErrors } = require("../util/error.js");
const { sendEmail } = require("../util/mailer.js");
const { maskEmail } = require("../util/maskEmail.js");

exports.sendEmailVerificationCode = async (req, res, next) => {
  try {
    if (req.userData && req.userData.email_validation != 1 && !req.userData.is_blocked) {
      sendEmail(
        req.userData.email,
        "Email verification code",
        "Your verification code<br /><strong>" +
          req.userData.email_validation +
          "</strong>",
        ({ error, info }) => {
          if (!error) {
            res.status(200).send(maskEmail(req.userData.email));
          } else {
            res.status(401).json(error);
          }
        }
      );
    }
  } catch (error) {
    handleErrors(error, res, 500);
  }
};
