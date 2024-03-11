const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { roles } = require("../../role/constant.js");
const { tableUser, tableUserRole } = require("../constant.js");
const { checkTableQuery } = require("../../util/constant.js");
const { createTableUserRole } = require("./userRole.js");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableUser} (
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
  const query = `INSERT INTO ${tableUser} (display_name, email, username, password, email_validation) VALUES ($1, $2, $3, $4, $5)`;
  await pool.query(query, [
    roles.superAdmin,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_USERNAME,
    hashedPassword,
    1,
  ]);
};

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log(`* ${tableUser}: table created successfully`);

    await insertAdminUser();
    console.log(
      `* ${tableUser}: ${roles.superAdmin} user created successfully \n`
    );
  } catch (error) {
    console.error(`** Error creating table ${tableUser}:`, error);
  }
};

exports.createTableUser = async () => {
  try {
    const user = await pool.query(checkTableQuery, [tableUser]);
    const userRole = await pool.query(checkTableQuery, [tableUserRole]);

    if (user.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableUser}`);
        await createTable();
      } else console.log(`* ${tableUser}: exist`);
    } else await createTable();

    if (userRole.rows[0].exists) {
      if (process.env.RECREATE_ALL_TABLE === "true") {
        await pool.query(`DROP TABLE IF EXISTS ${tableUserRole}`);
        await createTableUserRole();
      } else console.log(`* ${tableUserRole}: exist`);
    } else await createTableUserRole();
  } catch (error) {
    console.error(`** Error checking table ${tableUser}:`, error);
  }
};
