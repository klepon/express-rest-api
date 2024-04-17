const request = require("supertest");
const app = require("../../../app");
const pool = require("../../../database/pool");
const { table } = require("../constant");
const { getPath } = require("../../../util/util");
const { userPath } = require("../router");

exports.username = "12345678a_-";
exports.password = "1aB!@# $%^&*()_-";

exports.removeTestScheduleData = async (puid) => {
  try {
    await pool.query(`DELETE FROM ${table.schedule} WHERE puid = $1`, [puid]);
  } catch (_err) {}
};

exports.removeTestUserData = async () => {
  try {
    await pool.query(
      `DELETE FROM ${table.user} WHERE email = $1 OR email = $2`,
      ["test@test.com", "edit-test@test.com"]
    );
  } catch (_err) {}
};

exports.createTestUserData = async () => {
  try {
    return await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: this.username,
      password: this.password,
    });
  } catch (_err) {
    return;
  }
};

exports.getToken = async () => {
  const res = await request(app).post("/user/login").send({
    username: this.username,
    password: this.password,
  });
  return JSON.parse(res.text).token;
};

exports.getProfile = async (token) => {
  const user = await request(app)
    .get(getPath(userPath, userPath.profile))
    .set("Authorization", token);
  return JSON.parse(user.text);
};
