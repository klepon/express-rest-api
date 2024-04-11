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

exports.debugError = (error) => {
  if (process.env.DEBUG_ERROR_REST_API === "true") {
    console.error("")
    console.error("\x1b[1m\x1b[31m%s\x1b[0m", `Error ${error.from}:`);
    delete error.from;
    console.error(error);
    console.error("============\n");
  }
};

// formating detail error like validation
const formatError = (code, error) => {
  const data = {};
  data.detail = error.detail || defaultErrorMessage(code);

  if (error.code) data.code = error.code;
  if (error.type) data.type = error.type;
  if (error.missings) data.missings = error.missings;
  if (error.invalids) data.invalids = error.invalids;

  return data;
};

exports.throwError = (code, from, error) => {
  if (typeof error === "Error") {
    return formatError(code, error);
  }

  const newError = new Error("====== kasih warna " + from);
  newError.from = from;

  switch (typeof error) {
    case "string":
      newError.detail = error;
      break;
    case "object":
      newError = {
        ...newError,
        ...error,
      };
      break;
  }

  throw formatError(code, newError);
};
