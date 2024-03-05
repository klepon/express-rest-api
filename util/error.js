const fatalError = (message, description) => {
  console.error("Error: ", message);
  if (description) {
    console.error("==== ", description);
  }
  process.exit(1);
};

module.exports = fatalError;
