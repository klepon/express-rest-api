const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { table } = require("./constant.js");
const { debugError } = require("../../util/error.js");
const { checkTableQuery } = require("../../util/constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${table.user} (
    uid SERIAL PRIMARY KEY,
    puid UUID DEFAULT uuid_generate_v4() UNIQUE,
    display_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_validation INTEGER NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    avatar_id INTEGER,
    bio VARCHAR(255),
    address VARCHAR(255),
    latlng VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timezone CHAR(3)
  )
`;

const insertAdminUser = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const query = `INSERT INTO ${table.user} (display_name, email, username, password, email_validation) VALUES ($1, $2, $3, $4, $5)`;
  await pool.query(query, [
    "Super User",
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_USERNAME,
    hashedPassword,
    1,
  ]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`\u2713 Table ${table.user} created successfully`);

    await insertAdminUser();
    console.log(`\u2713 Super User created successfully \n`);
  } catch (error) {
    error.from = `Creating table ${table.user}`;
    debugError(error)
  }
};

exports.userTable = async () => {
  try {
    const user = await pool.query(checkTableQuery, [table.user]);

    if (user.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${table.user}`);
        await createTable();
      } else console.log(`\u2713 Table ${table.user} check`);
    } else await createTable();
  } catch (error) {
    error.from = "Checking tabel user";
    debugError(error);
  }
};
