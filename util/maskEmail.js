exports.maskEmail = (email) => {
  const keepChar = 3;
  const [username, domain] = email.split("@");
  const maskLength = Math.max(username.length - keepChar, username.length);
  const unMaskedChars =
    maskLength > 3 ? keepChar : Math.max(0, Math.floor(maskLength / 2));
  const maskedUsername =
    username.substring(0, unMaskedChars) +
    "*".repeat(Math.max(0, maskLength - unMaskedChars));

  return maskedUsername + "@" + domain;
};
