/** 
 * required input properties for verify email
 * 
 * POST
 * body { 
    code: string,
 }
 * passing:
 * object req.inputToValidate
 * array req.reqInputProps
 */

 exports.verifyEmailData = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.reqInputProps = ["code"];
  next();
};
