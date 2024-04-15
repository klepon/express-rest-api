const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData } = require("./util");

let token = "";
describe("Test Endpoint GET Profile /user/profile", () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    const res = await request(app).post("/user/login").send({
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    token = JSON.parse(res.text).token;
  });

  it('Should return "Missing token"', async () => {
    const res = await request(app).get("/user/profile");
    assert.equal(res.status, 401);
    assert.equal(
      res.text,
      '{"detail":"Unauthorized","service":"AuthToken no token"}'
    );
  });

  it('Should return "Invalid token"', async () => {
    const res = await request(app)
      .get("/user/profile")
      .set("Authorization", "invalidteoken");
    assert.equal(res.status, 403);
    assert.equal(
      res.text,
      '{"detail":"Forbidden","service":"AuthToken invalid"}'
    );
  });

  it('Should return "User not found"', async () => {
    const res = await request(app)
      .get("/user/profile")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWlkIjoiMGZjM2U2NWEtZWMzZC00ZDQ4LWEyZDYtZGM0YjQ1ZDQ4YWI0IiwiaWF0IjoxNzEzMTM4NDgyLCJleHAiOjE3MTM3NDMyODJ9.-Hs4d8iXLor4IkdgIR0NLDd3RlZVLIFAnQFm26sA1-0"
      );
    assert.equal(res.status, 404);
    assert.equal(res.text, '{"detail":"User not found","service":"Read user"}');
  });

  it('Should return "Profile"', async () => {
    const res = await request(app)
      .get("/user/profile")
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
    await removeTestUserData();
  });
});
