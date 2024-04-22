const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { prepareTestUserdata } = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { userPath, nonExistPuidToken } = require("../constant");
const { getPath } = require("../../../util/util");
const { deleteUserRecord } = require("../middleware/deleteUserRecord");

const path = getPath(userPath, userPath.profile);
const requestType = "delete";
let token;
let uid;

describe(`Test Endpoint Verify email address, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    [token, uid] = await prepareTestUserdata();
  });

  testAuth(requestType, path);

  it('Should return "User not found"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", nonExistPuidToken);
    assert.equal(res.status, 404);
    assert.equal(res.text, `{"detail":"User not found","service":"Read user"}`);
  });

  it('Should return "User added to deletion schedule"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token);
    assert.equal(res.status, 200);
    assert.equal(res.text, "User will be deleted in 28 days");
  });

  after(async () => {
    await deleteUserRecord(uid);
  });
});
