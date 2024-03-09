exports.deletedUid = "deletedUid";
exports.checkTableQuery =
  "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)";
