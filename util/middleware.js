/* use to mark any route to act as middleware
* use case:
* profile.js
* use by sendEmailVerificationCode to get user data
*/
exports.isMiddleWare = (req, _res, next) => {
  req.isMiddleWare = true;
  next();
};