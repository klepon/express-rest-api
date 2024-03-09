const bcrypt = require("bcrypt");
const pool = require("../database/pool.js");
const { superAdmin } = require("../role/databaseRole.js");
const { getRoleID } = require("../role/getPermission.js");
const { roleSuperAdmin } = require("../role/constant.js");
const { tableName } = require("./constant.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    uid SERIAL PRIMARY KEY,
    puid UUID DEFAULT uuid_generate_v4() UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_validation INTEGER NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    role VARCHAR(255) NOT NULL,
    avatar_id INTEGER,
    bio VARCHAR(255),
    address VARCHAR(255),
    latlng VARCHAR(30)
  )
`;

const insertAdminUser = async () => {
  const rid = await getRoleID(superAdmin);
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const query = `INSERT INTO ${tableName} (display_name, email, username, password, role, email_validation) VALUES ($1, $2, $3, $4, $5, $6)`;
  await pool.query(query, [
    roleSuperAdmin,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_USERNAME,
    hashedPassword,
    JSON.stringify([rid]),
    1,
  ]);
};

const insertUserRole = async () => {
  const userRole = [
    // [name, permission, c, r, u, d],
    ["SELF PROFILE", "USER_PROFILE", true, true, true, true],
  ];
  const query =
    "INSERT INTO " +
    tableName +
    " (name, permission, create, read, update, delete) VALUES ($1, $2, $3, $4, $5, $6)";
  await pool.query(query, ["Super Admin", "*", true, true, true, true]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tableName}: table created successfully`);

    await insertAdminUser();
    console.log(
      `* ${tableName}: ${roleSuperAdmin} user created successfully \n`
    );

    // await insertUserRole();
    // console.log(`User roles created successfully`);
  } catch (error) {
    console.error(`** Error creating table ${tableName}:`, error);
  }
};

exports.createTableUser = async () => {
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)",
      [tableName]
    );

    if (result.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableName};`);
        await createTable();
      } else console.log(`* ${tableName}: exist`);
    } else {
      await createTable();
    }
  } catch (error) {
    console.error(`** Error checking table ${tableName}:`, error);
  }
};
