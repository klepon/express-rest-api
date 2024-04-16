const request = require("supertest");
const assert = require("assert");
const app = require("../../../app");
const { removeTestUserData, createTestUserData } = require("./util");
const { getPath } = require("../../../util/util");
const { userPath } = require("../router");

const path = getPath(userPath, userPath.login);

describe(`Test Endpoint Login, POST ${path}`, () => {
  before(async () => {
    await removeTestUserData();
    await createTestUserData();
  });

  it('Should return "Auth Token"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-",
    });
    const json = JSON.parse(res.text);
    assert.equal(res.status, 200);
    assert.ok(Object.keys(json).includes("token"));
  });

  it('Should return "Missing username"', async () => {
    const res = await request(app).post(path).send({
      username: "",
      password: "1aB!@#$%^&*()_-",
    });

    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["username"],"invalids":[]}'
    );
  });

  it('Should return "Missing password"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-",
    });

    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":["password"],"invalids":[]}'
    );
  });

  it('Should return "Invalid username"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-?",
      password: "1aB!@#$%^&*()_-",
    });

    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["username"]}'
    );
  });

  it('Should return "Invalid password"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-",
      password: "1aB!@#$%^&*()<_-",
    });

    assert.equal(res.status, 400);
    assert.equal(
      res.text,
      '{"detail":"Bad Request","service":"Input validation","missings":[],"invalids":["password"]}'
    );
  });

  it('Should return "User not found"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-c",
      password: "1aB!@#$%^&*()_-",
    });

    assert.equal(res.status, 401);
    assert.equal(
      res.text,
      '{"detail":"Unauthorized","service":"Login get user"}'
    );
  });

  it('Should return "Wrong password"', async () => {
    const res = await request(app).post(path).send({
      username: "12345678a_-",
      password: "1aB!@#$%^&*()_-d",
    });

    assert.equal(res.status, 401);
    assert.equal(
      res.text,
      '{"detail":"Unauthorized","service":"Login check password"}'
    );
  });

  after(async () => {
    await removeTestUserData();
  });
});
