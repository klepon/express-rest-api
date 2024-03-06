const isMissingProperty = (dataObj, requiredProperties, throwError = false) => {
  const missing = [];
  for (const prop of requiredProperties) {
    const { [prop]: value = null } = dataObj;
    if (value === null || value === undefined) {
      missing.push(prop);
    }
  }

  if (throwError && missing.length > 0) {
    const error = new Error("On Checking property, see detail bellow");
    error.detail = "Mising properties";
    error.deatilItems = missing;
    throw error;
  }

  return missing;
};

module.exports = isMissingProperty;
