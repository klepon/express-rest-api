/** 
 * required input properties for login
 * POST
 * body { 
    username: string, 
    password: string 
 }
 * response:
 * object req.inputToValidate
 * array req.reqInputProps
 */

exports.inputLogin = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.reqInputProps = ["username", "password"];
  next();
};
