const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const {
  removeTestUserData,
  createTestUserData,
  getToken,
  getProfile,
  removeTestScheduleData,
} = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { userPath, nonExistPuidToken } = require("../constant");
const { getPath } = require("../../../util/util");

const path = getPath(userPath, userPath.profile);
const requestType = "delete";
let token = "";

describe(`Test Endpoint Verify email address, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    token = await getToken();
  });

  testAuth(requestType, path);

  it('Should return "Fail deleting user"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", nonExistPuidToken);
    assert.equal(res.status, 400);
    assert.ok(
      [
        '{"detail":"Fail deleting user","service":"Remove user"}',
        '{"detail":"Fail scheduling delete user","service":"Remove user"}',
      ].includes(res.text)
    );
  });

  it('Should return "User added to deletion schedule"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token);
    assert.equal(res.status, 200);
    assert.equal(res.text, "User will be deleted in 28 days");
  });

  afterEach(async () => {
    const user = await getProfile(token);
    if (user) {
      await removeTestScheduleData(user.puid);
    }
  });

  after(async () => {
    await removeTestUserData();
  });
});
