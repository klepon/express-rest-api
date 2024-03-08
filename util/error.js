exports.fatalError = (message, description) => {
  console.error("==== Error: ", message);
  if (description) {
    console.error("==== ", description);
  }
  process.exit(1);
};

exports.debugError = (error) => {
  if (process.env.DEBUG_ERROR_REST_API === "true") {
    console.error(
      '==== debugError active, set DEBUG_ERROR_REST_API="false" to turn off ===='
    );
    console.error("=== error: ", error);
  }
};

exports.handleErrors = (error, res, resCode) => {
  exports.debugError(error);

  const errorCode = error.code || "-";
  const errorSeverity = error.severity || "-";
  const errorDetail = error.detail || "Internal Server Error";
  const errorMissingItems = error.misingItems || [];
  const errorInvalidItems = error.invalidItems || [];

  res.status(resCode).json({
    error: {
      code: errorCode,
      severity: errorSeverity,
      detail: errorDetail,
      missing: errorMissingItems,
      invalid: errorInvalidItems,
    },
  });
};
