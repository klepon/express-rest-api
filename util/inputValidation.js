const { throwError } = require("./error");

/**
 * alphanumeric
 * [_-]
 * VALIDATION_USERNAME_MIN_CHAR || 8
 * max char 50
 */
const userName = (text) => {
  const minLength = process.env.VALIDATION_USERNAME_MIN_CHAR || 8;
  const regexString = `^[a-zA-Z0-9_-]{${minLength},50}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/** use for global name like display name, role name, group name, etc
 * alphanumeric
 * [s_-]
 * VALIDATION_USERNAME_MIN_CHAR || 4
 * max char 50
 */
const displayName = (text) => {
  const minLength = process.env.VALIDATION_DISPLAYNAME_MIN_CHAR || 4;
  const regexString = `^[a-zA-Z0-9\\s_-]{${minLength},50}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/**
 * start min 2 alphanumeric
 * follow by group of
 *  single VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_EMAIL || "+-_"
 *  alphanumeric
 * follow by @
 * follow by group of (max group VALIDATION_EMAIL_MAX_SUB_DOMAIN_DEEP || 1)
 *  alphanumeric
 *  single VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_DOMAIN || "-_"
 *  alphanumeric
 *  .
 * end with min 2 alpha
 * max char 100
 */
const email = (text) => {
  const allowedSpecialCharInEmail =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_EMAIL || "+-_";
  const allowedSpecialCharInDomain =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_DOMAIN || "-_";
  const maxSubDomainDeep =
    1 + (process.env.VALIDATION_EMAIL_MAX_SUB_DOMAIN_DEEP || 1);
  const regexString = `^[a-zA-Z0-9]{2,}(?:[${allowedSpecialCharInEmail}]{0,1}[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+(?:[${allowedSpecialCharInDomain}]{0,1}[a-zA-Z0-9]+)*\\.){1,${maxSubDomainDeep}}[a-zA-Z]{2,}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text) || text.length > 100) {
    return false;
  }
  return true;
};

/**
 * min 1 of each lowercase, uppercase, number, [!@#$%^&*()_-]
 * min char VALIDATION_PASSWORD_MIN_CHAR || 8
 * max char 255
 */
const password = (text) => {
  const minLength = process.env.VALIDATION_PASSWORD_MIN_CHAR || 8;
  const regexString = `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\\-])[a-zA-z0-9!@#$%^&*()_\\-]{${minLength},255}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/** use for any short desc like bio, status, comment, etc
 * alphanumeric, [\s.,-]]
 * max char 255
 */
const bio = (text) => {
  return /^[a-zA-Z0-9\s.,-]{1, 255}$/.test(text);
};

/**
 * alphanumeric, [\s.,]]
 * max char 255
 */
const address = (text) => {
  return /^[a-zA-Z0-9\s.,]{1, 255}$/.test(text);
};

/**
 * float,float
 * max char 30
 */
const latlng = (text) => {
  return /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(text) && text.length <= 30;
};

/**
 * 6 digit number
 */
const code = (text) => {
  return /^[0-9]{6,6}$/.test(text);
};

/** user for any config like permission
 * group of uppercase end with/without :
 * end with uppercase
 * max char 100
 */
const permission = (text) => {
  const regex = /^[A-Z]+(?::([A-Z]+|\\{[A-Z]+\\}))*$/;
  if (!regex.test(text) || text.length > 100) {
    return false;
  }
  return true;
};

const uuidv4 = (text) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    text
  );
};

const validate = (check, text) => {
  switch (check) {
    case "display_name":
    case "name":
      return displayName(text);
    case "username":
      return userName(text);
    case "email":
      return email(text);
    case "password":
      return password(text);
    case "is_blocked":
      return typeof text === "boolean";
    case "avatar_id":
    case "uid":
      return Number.isInteger(text);
    case "bio":
      return bio(text);
    case "address":
      return address(text);
    case "latlng":
      return latlng(text);
    case "code":
      return code(text);
    case "permission":
      return permission(text);
    case "puid":
      return uuidv4(text);
  }
  return true;
};

/**
 * check missing and invalid property
 * 
 * required: 
 * object req.inputToValidate
 * array req.reqInputProps
 * 
 * response:
 * next()
 * 400
 * {
    "detail": "Missing property or invalid value",
    "missings": [coloumn_name]
    "invalids": [coloumn_name]
  }
 */
exports.inputValidation = (req, _res, next) => {
  const missings = [];
  const invalids = [];
  for (const prop of req.reqInputProps) {
    const { [prop]: value = null } = req.inputToValidate;
    if (value === null || value === undefined) {
      missings.push(prop);
    }
    if (!validate(prop, req.inputToValidate[prop])) {
      invalids.push(prop);
    }
  }

  if (missings.length > 0 || invalids.length > 0) {
    throwError(400, "Input validation", { missings, invalids });
  }
  next();
};
