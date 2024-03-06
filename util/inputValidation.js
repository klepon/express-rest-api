require("dotenv").config();

const userName = (text) => {
  const minLength = process.env.VALIDATION_USERNAME_MIN_CHAR || 4;
  const regexString = `^[a-zA-Z0-9_-]{${minLength},}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

const displayName = (text) => {
  const minLength = process.env.VALIDATION_DISPLAYNAME_MIN_CHAR || 4;
  const regexString = `^[a-zA-Z0-9\s_-]{${minLength},}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

const email = (text) => {
  const allowedSpecialCharInEmail =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_EMAIL || "+-_";
  const allowedSpecialCharInDomain =
    process.env.VALIDATION_EMAIL_ALLOWED_SPECIAL_CHAR_IN_DOMAIN || "-_";
  const maxSubDomainDeep =
    1 + (process.env.VALIDATION_EMAIL_MAX_SUB_DOMAIN_DEEP || 1);
  const regexString = `^[a-zA-Z0-9]{2,}(?:[${allowedSpecialCharInEmail}]{0,1}[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+(?:[${allowedSpecialCharInDomain}]{0,1}[a-zA-Z0-9]+)*\.){1,${maxSubDomainDeep}}[a-z]{2,}$`;
  const regex = new RegExp(regexString);
  if (!regex.test(text)) {
    return false;
  }
  return true;
};

module.exports = {
  userName,
  displayName,
  email,
};
