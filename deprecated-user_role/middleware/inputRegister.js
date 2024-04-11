/** 
 * required input properties for register user
 * POST
 * body { 
    display_name: string, 
    email: string, 
    username: string, 
    password: string 
 }
 * response:
 * object req.inputToValidate
 * array req.reqInputProps
 */

exports.inputRegister = async (req, _res, next) => {
  req.inputToValidate = req.body;
  req.reqInputProps = ["display_name", "email", "username", "password"];
  next();
};
