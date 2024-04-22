const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const {
  getProfile,
  email,
  emailEdit,
  username,
  prepareTestUserdata,
  usernameEdit,
} = require("./util");
const { testAuth } = require("../../../util/testAuth");
const { getPath } = require("../../../util/util");
const { userPath, table } = require("../constant");
const { deleteUserRecord } = require("../middleware/deleteUserRecord");
const pool = require("../../../database/pool");

const path = getPath(userPath, userPath.profile);
const requestType = "patch";
let token = "";
let uid;

describe(`Test Endpoint Profile, ${requestType.toUpperCase()} ${path}`, () => {
  before(async () => {
    [token, uid] = await prepareTestUserdata();
  });

  it('Should return "Invalid display_name"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "asd?",
      email,
      username,
      avatar_id: 123,
      bio: "my bio here - ",
      address: "jala kertalangu 1-x",
      latlng: "-123.123,123.123",
      timezone: "-12",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["display_name"]}`
    );
  });

  it('Should return "Invalid email"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "asd _-",
      email: "invalid@maijima.com.net.id",
      username,
      avatar_id: 123,
      bio: "my bio here - ",
      address: "jala kertalangu 1-x",
      latlng: "-123.123,123.123",
      timezone: "-12",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["email"]}`
    );
  });

  it('Should return "Invalid username"', async () => {
    const res = await request(app)[requestType](path).send({
      username: "12345678?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["username"]}`
    );
  });

  it('Should return "Invalid avatar_id"', async () => {
    const res = await request(app)[requestType](path).send({
      avatar_id: "1.2",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["avatar_id"]}`
    );
  });

  it('Should return "Invalid bio"', async () => {
    const res = await request(app)[requestType](path).send({
      bio: "as as as ?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["bio"]}`
    );
  });

  it('Should return "Invalid address"', async () => {
    const res = await request(app)[requestType](path).send({
      bio: "",
      address: "asas?",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["address"]}`
    );
  });

  it('Should return "Invalid latlng"', async () => {
    const res = await request(app)[requestType](path).send({
      address: "adress-valid",
      latlng: "10.12,asd",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["latlng"]}`
    );
  });

  it('Should return "Invalid timezone"', async () => {
    const res = await request(app)[requestType](path).send({
      timezone: "-a2",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      `{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["timezone"]}`
    );
  });

  testAuth(requestType, path);

  it('Should return "Nothing to update"', async () => {
    const res = await request(app)
      [requestType](path)
      .send({
        display_name: "display name",
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
    const beforeData = await getProfile(token);

    const res = await request(app)
      [requestType](path)
      .send({
        display_name: "display name edit",
        username: usernameEdit,
        avatar_id: 123,
        bio: "my bio is this-100",
        address: "jalan dewi sartika, 120-x/2",
        latlng: "123.123,123.234",
        timezone: "-12",
      })
      .set("Authorization", token);

    const afterData = await getProfile(token);
    const afterShould = {
      ...beforeData,
      display_name: "display name edit",
      username: usernameEdit,
      avatar_id: 123,
      bio: "my bio is this-100",
      address: "jalan dewi sartika, 120-x/2",
      latlng: "123.123,123.234",
      timezone: "-12",
    };

    assert.equal(res.status, 200);
    assert.equal(res.text, `User updated successfully`);
    assert.notEqual(afterShould.update_at, afterData.update_at);

    delete afterShould.update_at;
    delete afterData.update_at;
    assert.deepEqual(afterData, afterShould);
  });

  it('Should return "Profile updated include email"', async () => {
    const beforeData = await getProfile(token);

    const res = await request(app)
      [requestType](path)
      .send({
        email: emailEdit,
        username: usernameEdit,
        avatar_id: 0,
        latlng: "",
      })
      .set("Authorization", token);

    const afterData = await getProfile(token);
    const afterShould = {
      ...beforeData,
      email: emailEdit,
      username: usernameEdit,
      avatar_id: 0,
      latlng: "",
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
    assert.deepEqual(afterData, afterShould);
  });

  it('Should return "Fail email exist"', async () => {
    const res = await request(app)
      [requestType](path)
      .send({
        email: process.env.ADMIN_EMAIL,
      })
      .set("Authorization", token);
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      `{"detail":"Key (email)=(${process.env.ADMIN_EMAIL}) already exists.","service":"App catch error","code":"23505"}`
    );
  });

  it('Should return "Fail username exist"', async () => {
    const res = await request(app)
      [requestType](path)
      .send({
        username: process.env.ADMIN_USERNAME,
        avatar_id: 211,
      })
      .set("Authorization", token);
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      `{"detail":"Key (username)=(${process.env.ADMIN_USERNAME}) already exists.","service":"App catch error","code":"23505"}`
    );
  });

  after(async () => {
    await deleteUserRecord(uid);
    try {
      await pool.query(
        `DELETE FROM ${table.user} WHERE email = $1 OR email = $2`,
        [email, emailEdit]
      );
    } catch (_err) {}
  });
});
