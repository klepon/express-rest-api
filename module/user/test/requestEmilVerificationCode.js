const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData, getToken } = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { userPath } = require("../router");
const { getPath } = require("../../../util/util");

const path = getPath(userPath, userPath.requestEmailVerificationCode);
let token = "";

describe(`Test Endpoint Request email verification code, GET ${path}`, () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    token = await getToken();
  });

  testAuth("get", path);

  it('Should return "Verification code sent"', async () => {
    const res = await request(app).get(path).set("Authorization", token);
    assert.equal(res.status, 200);
    assert.equal(res.text, "tes*@test.com");
  });

  it('Should return "Email already validate"', async () => {
    // get user
    const user = await request(app)
      .get(getPath(userPath, userPath.profile))
      .set("Authorization", token);

    // verify email
    const validate = await request(app)
      .patch(getPath(userPath, userPath.verifyEmail))
      .set("Authorization", token)
      .send({
        code: JSON.parse(user.text).email_validation,
      });

    const res = await request(app).get(path).set("Authorization", token);
    assert.equal(res.status, 400);
    assert.equal(res.text, '{"detail":"Email already verified","service":"Send verification email code"}');
  });

  after(async () => {
    await removeTestUserData();
  });
});
