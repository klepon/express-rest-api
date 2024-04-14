const bcrypt = require("bcrypt");
const pool = require("../../database/pool.js");
const { table } = require("./constant.js");
const { createTable } = require("../../database/createTable.js");
const { debugError } = require("../../util/error.js");

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

exports.userTable = async () => {
  try {
    await createTable({
      tableName: table.user,
      callback: insertAdminUser,
      callbackMessage: "Super User added",
      coloumn: [
        "uid SERIAL PRIMARY KEY",
        "puid UUID DEFAULT uuid_generate_v4() UNIQUE",
        "display_name VARCHAR(50) NOT NULL",
        "email VARCHAR(100) UNIQUE NOT NULL",
        "username VARCHAR(50) UNIQUE NOT NULL",
        "password VARCHAR(255) NOT NULL",
        "email_validation INTEGER NOT NULL",
        "is_blocked BOOLEAN DEFAULT FALSE",
        "in_delete_schedule BOOLEAN DEFAULT FALSE",
        "avatar_id INTEGER",
        "bio VARCHAR(255)",
        "address VARCHAR(255)",
        "latlng VARCHAR(30)",
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "timezone CHAR(3)",
      ],
    });
  } catch (error) {
    error.service = "User table";
    debugError(error);
    process.exit(1);
  }
};

exports.userHistoryTable = async () => {
  try {
    await createTable({
      tableName: table.history,
      coloumn: [
        "hid SERIAL PRIMARY KEY",
        "uid INTEGER",
        "update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "before VARCHAR(255) NOT NULL",
        "after VARCHAR(255) UNIQUE NOT NULL",
      ],
    });
  } catch (error) {
    error.service = "User history table";
    debugError(error);
    process.exit(1);
  }
};

exports.userDeletionSchedule = async () => {
  try {
    await createTable({
      tableName: table.schedule,
      coloumn: [
        "sid SERIAL PRIMARY KEY",
        "puid UUID",
        "delete_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      ],
    });
  } catch (error) {
    error.service = "User deletion schedule table";
    debugError(error);
    process.exit(1);
  }
};
