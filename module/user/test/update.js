const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData, getToken } = require("./util");

let token = "";

describe("Test Endpoint PATCH Profile /user/profile", () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
    token = await getToken();
  });

  it('Should return "Invalid display_name"', async () => {
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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
    const res = await request(app).patch("/user/profile").send({
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

  it('Should return "Missing token"', async () => {
    const res = await request(app).patch("/user/profile").send({});
    assert.equal(res.status, 401);
    assert.equal(
      res.text,
      `{"detail":"Unauthorized","service":"AuthToken no token"}`
    );
  });

  it('Should return "Token expired"', async () => {
    const res = await request(app)
      .patch("/user/profile")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWlkIjoiYjg4MTE3NDEtMzU4OS00NGRmLWIzNTItYmM2YTdmYjk3YThhIiwiaWF0IjoxNzEzMTk1NTgxLCJleHAiOjE3MTMxOTU1ODB9.CEBGjisp6DOiBy6v0_9IbDoOyNsAO-NbttX7jfyRzf0"
      );

    assert.equal(res.status, 403);
    assert.equal(
      res.text,
      `{"detail":"Forbidden","service":"AuthToken expired"}`
    );
  });

  it('Should return "Invalid token"', async () => {
    const res = await request(app)
      .patch("/user/profile")
      .set("Authorization", "invalidToken");
    assert.equal(res.status, 403);
    assert.equal(
      res.text,
      `{"detail":"Forbidden","service":"AuthToken invalid"}`
    );
  });

  it('Should return "Nothing to update"', async () => {
    const res = await request(app)
      .patch("/user/profile")
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
    const before = await request(app)
      .get("/user/profile")
      .set("Authorization", token);

    const res = await request(app)
      .patch("/user/profile")
      .send({
        display_name: "display name edit",
        username: "usernameEdit",
        avatar_id: null,
        bio: "asa",
        timezone: "-12",
      })
      .set("Authorization", token);

    const after = await request(app)
      .get("/user/profile")
      .set("Authorization", token);

    assert.equal(res.status, 200);
    assert.equal(res.text, `User updated successfully`);
    assert.equal(
      JSON.parse(before.text).email_validation,
      JSON.parse(after.text).email_validation
    );
  });

  it('Should return "Profile updated include email"', async () => {
    const before = await request(app)
      .get("/user/profile")
      .set("Authorization", token);

    const res = await request(app)
      .patch("/user/profile")
      .send({
        email: "edit-test@test.com",
        username: "usernameEdit",
        bio: "bio edit",
      })
      .set("Authorization", token);

    const after = await request(app)
      .get("/user/profile")
      .set("Authorization", token);

    assert.equal(res.status, 200);
    assert.equal(res.text, `User updated successfully`);
    assert.notEqual(
      JSON.parse(before.text).email_validation,
      JSON.parse(after.text).email_validation
    );
  });

  it('Should return "Fail email exist"', async () => {
    await createTestUserData();
    token = await getToken();

    const res = await request(app)
      .patch("/user/profile")
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
      .patch("/user/profile")
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
