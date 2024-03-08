const { Role } = require("../user/constant");
const {
  displayName,
  userName,
  email,
  password,
  latlng,
  bio,
  address,
  code,
} = require("./inputValidation");

const validate = (check, text) => {
  switch (check) {
    case "display_name":
      return displayName(text);
    case "username":
      return userName(text);
    case "email":
      return email(text);
    case "password":
      return password(text);
    case "is_blocked":
      return typeof text === "boolean";
    case "role":
      return Role[text] === text;
    case "avatar_id":
      return Number.isInteger(text);
    case "bio":
      return bio(text);
    case "address":
      return address(text);
    case "latlng":
      return latlng(text);
    case "code":
      return code(text);
  }
  return true;
};

exports.propertyChecker = (dataObj, requiredProperties) => {
  const missing = [];
  const invalid = [];
  for (const prop of requiredProperties) {
    const { [prop]: value = null } = dataObj;
    if (value === null || value === undefined) {
      missing.push(prop);
    }
    if (!validate(prop, dataObj[prop])) {
      invalid.push(prop);
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const error = new Error("On Checking property, see detail bellow");
    error.detail = "Missing property or invalid value";
    if (missing.length > 0) {
      error.misingItems = missing;
    }
    if (invalid.length > 0) {
      error.invalidItems = invalid;
    }
    throw error;
  }

  return missing;
};
