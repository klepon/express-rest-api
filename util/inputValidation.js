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
    return [false, null];
  }
  return [true, text];
};

/** use for global name like display name, role name, group name, etc
 * alphanumeric
 * [ _-]
 * VALIDATION_USERNAME_MIN_CHAR || 4
 * max char 50
 */
const displayName = (text) => {
  const minLength = process.env.VALIDATION_DISPLAYNAME_MIN_CHAR || 4;
  const regexString = `^[a-zA-Z0-9 _-]{${minLength},50}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
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
    (process.env.VALIDATION_EMAIL_MAX_SUB_DOMAIN_DEEP.trim() || 1) * 1 + 1;
  const regexString = `^[a-zA-Z0-9]{2,}(?:[${allowedSpecialCharInEmail}]{0,1}[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+(?:[${allowedSpecialCharInDomain}]{0,1}[a-zA-Z0-9]+)*\\.){1,${maxSubDomainDeep}}[a-zA-Z]{2,}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text) || text.length > 100) {
    return [false, null];
  }
  return [true, text];
};

/**
 * min 1 of each lowercase, uppercase, number, space or [!@#$%^&*()_-]
 * min char VALIDATION_PASSWORD_MIN_CHAR || 8
 * max char 255
 */
const password = (text) => {
  const minLength = process.env.VALIDATION_PASSWORD_MIN_CHAR || 8;
  const regexString = `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*() _-])[a-zA-Z0-9!@#$%^&*() _-]{${minLength},255}$`;
  const regex = new RegExp(regexString);

  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

/** use for any short desc like bio, status, comment, etc
 * alphanumeric, [ .,-]
 * max char 255
 */
const bio = (text) => {
  const regexString = "^[a-zA-Z0-9 .,-]{1,255}$";
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

/**
 * alphanumeric, [ .,/-]
 * max char 255
 */
const address = (text) => {
  const regexString = "^[a-zA-Z0-9 .,/-]{1,255}$";
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

/**
 * float,float
 * max char 30
 */
const latlng = (text) => {
  const regexString = "^(-?\\d+(\\.\\d+)?),*(-?\\d+(\\.\\d+)?)$";
  const regex = new RegExp(regexString);
  if (!regex.test(text) && text.length <= 30) {
    return [false, null];
  }
  return [true, text];
};

/**
 * 6 digit number
 */
const code = (text) => {
  const regexString = "^[0-9]{6,6}$";
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

const uuidv4 = (text) => {
  const regexString =
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

const timezone = (text) => {
  const regexString = "^(\\+|-)?([1-9]|1[0-4])$";
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return [false, null];
  }
  return [true, text];
};

const integer = (text) => {
  return Number.isInteger(text) ? [true, Number.parseInt(text)] : [false, null];
};

const boolean = (text) => {
  return typeof text === "boolean" ? [true, text] : [false, null];
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
      return boolean(text);
    case "avatar_id":
    case "uid":
      return integer(text);
    case "bio":
      return bio(text);
    case "address":
      return address(text);
    case "latlng":
      return latlng(text);
    case "code":
      return code(text);
    case "puid":
      return uuidv4(text);
    case "timezone":
      return timezone(text);
  }
  return [false, null];
};

/**
 * check missing and invalid property
 * 
 * required: 
 * object req.inputToValidate
 * array req.reqInputProps
 * array req.optionalNoEmptyInputProps optional
 * array reg.optionalInputProps optional
 * 
 * passing:
 * req.cleanData
 * 
 * response:
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
  const data = {};

  const getValue = (prop) => {
    let { [prop]: value = null } = req.inputToValidate;
    return value && typeof value === "string" ? value.trim() : value;
  };

  const setData = (prop, value) => {
    data[prop] = value;
  };

  if (req.optionalInputProps) {
    for (const prop of req.optionalInputProps) {
      const value = getValue(prop);

      if (value === null) {
        continue;
      }

      if (value === "") {
        setData(prop, value);
        continue;
      }

      const [isValid, cleanValue] = validate(prop, value);

      if (value && !isValid) {
        invalids.push(prop);
      } else {
        setData(prop, cleanValue);
      }
    }
  }

  if (req.reqInputProps) {
    for (const prop of req.reqInputProps) {
      const value = getValue(prop);

      if (!value) {
        missings.push(prop);
      } else {
        const [isValid, cleanValue] = validate(prop, value);
        if (!isValid) {
          invalids.push(prop);
        } else {
          setData(prop, cleanValue);
        }
      }
    }
  }

  if (req.optionalNoEmptyInputProps) {
    for (const prop of req.optionalNoEmptyInputProps) {
      const value = getValue(prop);

      if (value === null) {
        continue;
      } else {
        const [isValid, cleanValue] = validate(prop, value);
        if (!isValid) {
          invalids.push(prop);
        } else {
          setData(prop, cleanValue);
        }
      }
    }
  }

  if (missings.length > 0 || invalids.length > 0) {
    throwError(400, "Input validation", { missings, invalids });
  }

  req.cleanData = data;
  next();
};
