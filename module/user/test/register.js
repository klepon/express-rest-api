const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData } = require("./util");

describe("Test Endpoint POST Register /user/register", () => {
  before(async () => {
    await removeTestUserData();
  });

  it('Should return "Missings display_name"', async () => {
    const res = await request(app).post("/user/register").send({
      email: "test@test.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["display_name"],"invalids":[]}'
    );
  });

  it('Should return "Missings email"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: " ",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["email"],"invalids":[]}'
    );
  });

  it('Should return "Missings username"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: " ",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["username"],"invalids":[]}'
    );
  });

  it('Should return "Missings password"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: "12345678a_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["password"],"invalids":[]}'
    );
  });

  it('Should return "Invalid display_name"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display @name",
      email: "test@test.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["display_name"]}'
    );
  });

  it('Should return "Invalid email"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@te@st.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["email"]}'
    );
  });

  it('Should return "Invalid username"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: "1234a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["username"]}'
    );
  });

  it('Should return "Invalid password"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: "12345678a_-",
      password: "1a!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["password"]}'
    );
  });

  it('Should return "User registered successfully"', async () => {
    const res = await createTestUserData();
    assert.equal(res.status, 200);
    assert.equal(res.text, "User registered successfully");
  });

  it('Should return "Email already exist"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "test@test.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      '{"detail":"Key (email)=(test@test.com) already exists.","service":"App catch error","code":"23505"}'
    );
  });

  it('Should return "Username already exist"', async () => {
    const res = await request(app).post("/user/register").send({
      display_name: "display name",
      email: "atest@test.com",
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      '{"detail":"Key (username)=(12345678a_-) already exists.","service":"App catch error","code":"23505"}'
    );
  });

  after(async () => {
    await removeTestUserData();
  });
});
