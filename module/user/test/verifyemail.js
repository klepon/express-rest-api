const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const {
  removeTestUserData,
  createTestUserData,
  getToken,
  getProfile,
} = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { userPath } = require("../router");
const { getPath } = require("../../../util/util");

const path = getPath(userPath, userPath.verifyEmail);
const requestType = "patch";
let token = "";

describe(`Test Endpoint Verify email address, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    token = await getToken();
  });

  it('Should return "Missing code"', async () => {
    const res = await request(app)[requestType](path).send({
      code: "",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["code"],"invalids":[]}'
    );
  });

  it('Should return "Invalid code"', async () => {
    const res = await request(app)[requestType](path).send({
      code: "asd1",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["code"]}'
    );
  });

  testAuth(requestType, path, { code: "123456" });

  it('Should return "Email verified fail"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token)
      .send({
        code: "123456",
      });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Email verified fail","service":"Verify email"}'
    );
  });

  it('Should return "Email verified"', async () => {
    const data = await getProfile(token);
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token)
      .send({
        code: data.email_validation,
      });
    assert.equal(res.status, 200);
    assert.equal(
      res.text,
      'Email verified successfully'
    );
  });

  it('Should return "Email already verified"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token)
      .send({
        code: "123456",
      });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Email already verified","service":"Verify email"}'
    );
  });

  after(async () => {
    await removeTestUserData();
  });
});
