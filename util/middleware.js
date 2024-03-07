/* use to mark any route to act as middleware
* use case:
* profile.js
* use by sendEmailVerificationCode to get user data
*/
exports.setAsMiddleWare = (req, _res, next) => {
  req.asMiddleWware = true;
  next();
};