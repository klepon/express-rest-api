const defaultErrorMessage = (code) => {
  switch (code) {
    case 400: //Permintaan yang tidak valid.
      return "Bad Request";
    case 401: //Permintaan membutuhkan otentikasi.
      return "Unauthorized";
    case 403: //Server memahami permintaan, tetapi menolak untuk mengautentikasi atau mengotorisasi pengguna.
      return "Forbidden";
    case 409: //Server tidak dapat memenuhi permintaan karena konflik dengan sumber daya yang ada
      return "Conflict";
    case 500:
      return "Internal Server Error";
    case 503:
      return "Service Unavailable";
  }
};

exports.fatalError = (message, description) => {
  console.error("==== Error: ", message);
  if (description) {
    console.error("==== ", description);
  }
  process.exit(1);
};

exports.debugErrorLine = (title, message) => {
  if (process.env.DEBUG_ERROR_REST_API === "true") {
    console.log("====== ", title);
    if (message) console.log(message);
  }
};

exports.debugError = (error, description, skip = false) => {
  if (skip) return;

  if (process.env.DEBUG_ERROR_REST_API === "true") {
    console.error(
      `* Debuging error active, set DEBUG_ERROR_REST_API="false" to turn off\n* ${description}\n=====================================`
    );
    console.error(error);
    console.error("\n=== End debuging error ===\n");
  }
};

// formating detail error like validation
const formatError = (code, error, detail, missings = null, invalids = null) => {
  const data = {};
  data.resCode = code;
  data.detail = error.detail || detail || defaultErrorMessage(code);

  if (error.code) data.code = error.code;
  if (error.type) data.type = error.type;
  if (missings) data.missings = missings;
  if (invalids) data.invalids = invalids;

  return data;
};

// create error for non try catch callerand format it
exports.throwError = (code, detail, missings, invalids) => {
  const error = new Error("from throwError() =========");
  return formatError(code, error, detail, missings, invalids);
};

// set error code and format it
exports.setErrorCode = (code, error) => {
  return formatError(code, error);
};
