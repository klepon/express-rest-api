const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { email, prepareTestUserdata } = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { userPath } = require("../constant");
const { getPath } = require("../../../util/util");
const { maskEmail } = require("../../../util/maskEmail");
const { deleteUserRecord } = require("../middleware/deleteUserRecord");

const path = getPath(userPath, userPath.requestEmailVerificationCode);
const requestType = "get";
let token = "";
let profile;
let uid;

describe(`Test Endpoint Request email verification code, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    [token, uid, profile] = await prepareTestUserdata();
  });

  testAuth(requestType, path);

  it('Should return "Verification code sent"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token);
    assert.equal(res.status, 200);
    assert.equal(res.text, maskEmail(email));
  });

  it('Should return "Email already validate"', async () => {
    await request(app)
      .patch(getPath(userPath, userPath.verifyEmail))
      .set("Authorization", token)
      .send({
        code: profile.email_validation,
      });

    const res = await request(app)
      [requestType](path)
      .set("Authorization", token);
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Email already verified","service":"Send verification email code"}'
    );
  });

  after(async () => {
    await deleteUserRecord(uid);
  });
});
