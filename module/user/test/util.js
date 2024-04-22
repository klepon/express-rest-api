const request = require("supertest");
const app = require("../../../app");
const { getPath } = require("../../../util/util");
const { userPath } = require("../constant");

exports.username = "12345678a_-";
exports.usernameEdit = "12345678a_-edit";
exports.password = "1aB!@# $%^&*()_-";
exports.email = "test@maijima.com";
exports.emailEdit = "edit-test@maijima.com";


const createTestUserData = async () => {
  try {
    await request(app).post(getPath(userPath, userPath.register)).send({
      display_name: "display name",
      email: this.email,
      username: this.username,
      password: this.password,
    });
  } catch (_err) {
    return;
  }
};

const getToken = async () => {
  const res = await request(app).post(getPath(userPath, userPath.login)).send({
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

exports.prepareTestUserdata = async () => {
  await createTestUserData();
  const token = await getToken();
  const profile = await this.getProfile(token);
  return [token, profile.uid, profile];
};
