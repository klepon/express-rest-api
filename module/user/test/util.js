const request = require("supertest");
const app = require("../../../app");
const pool = require("../../../database/pool");
const { table } = require("../constant");

exports.removeTestUserData = async () => {
  try {
    await pool.query(`DELETE FROM ${table.user} WHERE email = $1`, [
      "test@test.com",
    ]);
  } catch (_err) {}
};

exports.createTestUserData = async () => {
  try {
    return await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
  } catch (_err) {
    return;
  }
};
