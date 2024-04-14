const { debugError } = require("../util/error.js");
const pool = require("./pool.js");

const executeCreateTable = async (
  tableName,
  query,
  callback,
  callbackMessage
) => {
  try {
    await pool.query(query);
    console.log(`\u2713 Table ${tableName} created successfully`);

    if (callback) {
      await callback();
      console.log(`\u2713 ${callbackMessage}\n`);
    }
  } catch (error) {
    error.service = `Creating table ${tableName}`;
    debugError(error);
    process.exit(1);
  }
};

exports.createTable = async (props) => {
  try {
    const { tableName, coloumn, callback, callbackMessage } = props;
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${coloumn.join(
      ","
    )})`;
    const checkTableQuery =
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)";
    const result = await pool.query(checkTableQuery, [tableName]);

    if (result.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableName}`);
        await executeCreateTable(tableName, query, callback, callbackMessage);
      } else console.log(`\u2713 Table ${tableName} ready`);
    } else
      await executeCreateTable(tableName, query, callback, callbackMessage);
  } catch (error) {
    error.service = `Add table ${props.tableName}`;
    debugError(error);
    process.exit(1);
  }
};
