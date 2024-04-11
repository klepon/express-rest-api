/** 
 * required input properties for login
 * 
 * POST
 * body { 
    username: string, 
    password: string 
 }
 * passing:
 * object req.inputToValidate
 * array req.reqInputProps
 */

exports.loginData = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.reqInputProps = ["username", "password"];
  next();
};
