exports.filterObject = (obj, keys) => {
  return Object.keys(obj).reduce((filteredObj, key) => {
    if (keys.includes(key)) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {});
};
