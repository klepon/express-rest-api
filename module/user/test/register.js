const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { username, password, email } = require("./util");
const { getPath } = require("../../../util/util");
const { userPath, table } = require("../constant");
const pool = require("../../../database/pool");

const path = getPath(userPath, userPath.register);
const requestType = "post";

describe(`Test Endpoint Register, ${requestType.toUpperCase()} ${path}`, () => {
  it('Should return "Missings display_name"', async () => {
    const res = await request(app)[requestType](path).send({
      email,
      username,
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["display_name"],"invalids":[]}'
    );
  });

  it('Should return "Missings email"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email: " ",
      username,
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["email"],"invalids":[]}'
    );
  });

  it('Should return "Missings username"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email,
      username: " ",
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["username"],"invalids":[]}'
    );
  });

  it('Should return "Missings password"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email,
      username,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["password"],"invalids":[]}'
    );
  });

  it('Should return "Invalid display_name"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display @name",
      email,
      username,
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["display_name"]}'
    );
  });

  it('Should return "Invalid email"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email: "test@te@st.com",
      username,
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["email"]}'
    );
  });

  it('Should return "Invalid username"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email,
      username: "1234a_-",
      password,
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["username"]}'
    );
  });

  it('Should return "Invalid password"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email,
      username,
      password: "1a!@#$%^&*()_-",
    });
    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["password"]}'
    );
  });

  it('Should return "User registered successfully"', async () => {
    const res = await request(app).post(getPath(userPath, userPath.register)).send({
      display_name: "display name",
      email,
      username,
      password,
    });
    assert.equal(res.status, 200);
    assert.equal(res.text, "User registered successfully");
  });

  it('Should return "Email already exist"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email,
      username,
      password,
    });
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      `{"detail":"Key (email)=(${email}) already exists.","service":"App catch error","code":"23505"}`
    );
  });

  it('Should return "Username already exist"', async () => {
    const res = await request(app)[requestType](path).send({
      display_name: "display name",
      email: "some-email@maijima.com",
      username,
      password,
    });
    assert.equal(res.status, 500);
    assert.equal(
      res.text,
      `{"detail":"Key (username)=(${username}) already exists.","service":"App catch error","code":"23505"}`
    );
  });

  after(async () => {
    try {
      await pool.query(`DELETE FROM ${table.user} WHERE email = $1`, [email]);
    } catch (_err) {}
  });
});
