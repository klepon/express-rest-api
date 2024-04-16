const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData, getToken } = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { getPath } = require("../../../util/util");
const { userPath } = require("../router");

const path = getPath(userPath, userPath.profile);
let token = "";

describe(`Test Endpoint Profile, PATCH ${path}`, () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    token = await getToken();
  });

  it('Should return "Invalid display_name"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "asd?",
      email: "test@test.com.net",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["display_name"]}`
    );
  });

  it('Should return "Invalid email"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "asd _-",
      email: "test@test.com.net.id",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["email"]}`
    );
  });

  it('Should return "Invalid username"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      username: "12345678?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["username"]}`
    );
  });

  it('Should return "Invalid avatar_id"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      avatar_id: "1.2",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["avatar_id"]}`
    );
  });

  it('Should return "Invalid bio"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      bio: "as as as ?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["bio"]}`
    );
  });

  it('Should return "Invalid address"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      address: "asas?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["address"]}`
    );
  });

  it('Should return "Invalid latlng"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      latlng: "10.12,asd",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["latlng"]}`
    );
  });

  it('Should return "Invalid timezone"', async () => {
    const res = await request(app).patch(path).send({
      display_name: "",
      email: "",
      timezone: "-a2",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["timezone"]}`
    );
  });

  testAuth("patch", path);

  it('Should return "Nothing to update"', async () => {
    const res = await request(app)
      .patch(path)
      .send({
        timezone: null,
      })
      .set("Authorization", token);
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Nothing to update","service":"Update user"}`
    );
  });

  it('Should return "Profile updated exclude email"', async () => {
    const before = await request(app).get(path).set("Authorization", token);

    const res = await request(app)
      .patch(path)
      .send({
        display_name: "display name edit",
        username: "usernameEdit",
        avatar_id: null,
        bio: "asa",
        timezone: "-12",
      })
      .set("Authorization", token);

    const after = await request(app).get(path).set("Authorization", token);

    const beforeData = JSON.parse(before.text);
    const afterData = JSON.parse(after.text);
    const afterShould = {
      ...beforeData,
      display_name: "display name edit",
      username: "usernameEdit",
      bio: "asa",
      timezone: "-12",
    };

    assert.equal(res.status, 200);
    assert.equal(res.text, `User updated successfully`);
    assert.notEqual(afterShould.update_at, afterData.update_at);

    delete afterShould.update_at;
    delete afterData.update_at;
    assert.deepEqual(afterShould, afterData);
  });

  it('Should return "Profile updated include email"', async () => {
    const before = await request(app).get(path).set("Authorization", token);

    const res = await request(app)
      .patch(path)
      .send({
        email: "edit-test@test.com",
        username: "usernameEdit",
        bio: "bio edit",
      })
      .set("Authorization", token);

    const after = await request(app).get(path).set("Authorization", token);

    const beforeData = JSON.parse(before.text);
    const afterData = JSON.parse(after.text);
    const afterShould = {
      ...beforeData,
      email: "edit-test@test.com",
      username: "usernameEdit",
      bio: "bio edit",
    };

    assert.equal(res.status, 200);
    assert.equal(res.text, `User updated successfully`);
    assert.equal(afterShould.email, afterData.email);
    assert.notEqual(afterShould.email_validation, afterData.email_validation);
    assert.notEqual(afterShould.update_at, afterData.update_at);

    delete afterShould.update_at;
    delete afterData.update_at;
    delete afterShould.email_validation;
    delete afterData.email_validation;
    assert.deepEqual(afterShould, afterData);
  });

  it('Should return "Fail email exist"', async () => {
    await createTestUserData();
    token = await getToken();

    const res = await request(app)
      .patch(path)
      .send({
        email: "edit-test@test.com",
      })
      .set("Authorization", token);
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      '{"detail":"Key (email)=(edit-test@test.com) already exists.","service":"App catch error","code":"23505"}'
    );
  });

  it('Should return "Fail username exist"', async () => {
    token = await getToken();

    const res = await request(app)
      .patch(path)
      .send({
        username: "usernameEdit",
        avatar_id: 211,
      })
      .set("Authorization", token);
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      '{"detail":"Key (username)=(usernameEdit) already exists.","service":"App catch error","code":"23505"}'
    );
  });

  after(async () => {
    await removeTestUserData();
  });
});
