const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { testAuth } = require("../../../util/testAuth");
const { getPath } = require("../../../util/util");
const { userPath, nonExistPuidToken } = require("../constant");
const { prepareTestUserdata } = require("./util");
const { deleteUserRecord } = require("../middleware/deleteUserRecord");

const path = getPath(userPath, userPath.profile);
const requestType = "get";
let token = "";
let uid;

describe(`Test Endpoint Profile, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    [token, uid] = await prepareTestUserdata();
  });

  testAuth(requestType, path);

  it('Should return "User not found"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", nonExistPuidToken);
    assert.equal(res.status, 404);
    assert.equal(res.text, '{"detail":"User not found","service":"Read user"}');
  });

  it('Should return "Profile"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", token);
    const test = Object.keys(JSON.parse(res.text));
    const keys = [
      "puid",
      "display_name",
      "email",
      "username",
      "email_validation",
      "is_blocked",
      "in_delete_schedule",
      "avatar_id",
      "bio",
      "address",
      "latlng",
      "created_at",
      "update_at",
      "timezone",
    ];
    assert.equal(res.status, 200);
    assert.ok(keys.filter((key) => test.includes(key)).length === keys.length);
  });

  after(async () => {
    await deleteUserRecord(uid)
  });
});
