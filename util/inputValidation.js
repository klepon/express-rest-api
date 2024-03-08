/**
 * alphanumeric
 * [_-]
 * VALIDATION_USERNAME_MIN_CHAR || 8
 */
exports.userName = (text) => {
  const minLength = process.env.VALIDATION_USERNAME_MIN_CHAR || 8;
  const regexString = `^[a-zA-Z0-9_-]{${minLength},}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/**
 * alphanumeric
 * [s_-]
 * VALIDATION_USERNAME_MIN_CHAR || 4
 */
exports.displayName = (text) => {
  const minLength = process.env.VALIDATION_DISPLAYNAME_MIN_CHAR || 4;
  const regexString = `^[a-zA-Z0-9\\s_-]{${minLength},}$`;
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
 */
exports.email = (text) => {
  const allowedSpecialCharInEmail =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_EMAIL || "+-_";
  const allowedSpecialCharInDomain =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_DOMAIN || "-_";
  const maxSubDomainDeep =
    1 + (process.env.VALIDATION_EMAIL_MAX_SUB_DOMAIN_DEEP || 1);
  const regexString = `^[a-zA-Z0-9]{2,}(?:[${allowedSpecialCharInEmail}]{0,1}[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+(?:[${allowedSpecialCharInDomain}]{0,1}[a-zA-Z0-9]+)*\\.){1,${maxSubDomainDeep}}[a-zA-Z]{2,}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/**
 * min 1 of each lowercase, uppercase, number, [!@#$%^&*()_-]
 * min char VALIDATION_PASSWORD_MIN_CHAR || 8
 */
exports.password = (text) => {
  const minLength = process.env.VALIDATION_PASSWORD_MIN_CHAR || 8;
  const regexString = `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\\-])[a-zA-z0-9!@#$%^&*()_\\-]{${minLength},}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

/**
 * alphanumeric, [\s.,-]]
 */
exports.bio = (text) => {
  return /^[a-zA-Z0-9\s.,-]+$/.test(text);
};

/**
 * alphanumeric, [\s.,]]
 */
exports.address = (text) => {
  return /^[a-zA-Z0-9\s.,]+$/.test(text)
}

/**
 * float,float
 */
exports.latlng = (text) => {
  return /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(text);
};

/**
 * 6 digit number
 */
exports.code = (text) => {
  return /^[0-9]{6,6}$/.test(text);
};
