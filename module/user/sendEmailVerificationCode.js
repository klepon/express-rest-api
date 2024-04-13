/** send email verification code
 * 
 * required:
 * object req.cleanData
 * or
 * object req.userAuthData
 * optional string req.onFinish
 * 
 * response:
 * 200, masked target email, ang*********@gmail.com
 * 401, {
    "code": "EAUTH",
    "response": "534-5.7.9 Application-specific password required. For more information, go to\n534 5.7.9  https://support.google.com/mail/?p=InvalidSecondFactor g24-20020a170902869800b001dbae7b85b1sm14176175plo.237 - gsmtp",
    "responseCode": 534,
    "command": "AUTH PLAIN"
  }
 */

const { throwError } = require("../../util/error.js");
const { sendEmail } = require("../../util/mailer.js");
const { maskEmail } = require("../../util/maskEmail.js");
const { validEmailValue } = require("./constant.js");

exports.sendEmailVerificationCode = (req, res, next) => {
  try {
    const { email, email_validation } = req.cleanData || req.userAuthData;
    if (email_validation === validEmailValue) {
      throwError(400, "Send verification email code", "Email already verified");
    }

    sendEmail(
      email,
      "Email verification code",
      "Your verification code<br /><strong>" + email_validation + "</strong>",
      ({ error }) => {
        if (!req.onFinish) {
          if (!error) {
            res.status(200).send(maskEmail(email));
          } else {
            throwError(401, "Send email", "Fail sending email");
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
