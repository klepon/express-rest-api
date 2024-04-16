const request = require("supertest");
const assert = require("assert");
const app = require("../app");

exports.testAuth = async (requestType, path, body) => {
  it('Should return "Missing token"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", "")
      .send(body);
    assert.equal(res.status, 401);
    assert.equal(
      res.text,
      `{"detail":"Unauthorized","service":"AuthToken missing"}`
    );
  });

  it('Should return "Invalid token"', async () => {
    const res = await request(app)
      [requestType](path)
      .set("Authorization", "invalidToken")
      .send(body);
    assert.equal(res.status, 403);
    assert.equal(
      res.text,
      `{"detail":"Forbidden","service":"AuthToken invalid"}`
    );
  });

  it('Should return "Token expired"', async () => {
    const res = await request(app)
      [requestType](path)
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWlkIjoiYjg4MTE3NDEtMzU4OS00NGRmLWIzNTItYmM2YTdmYjk3YThhIiwiaWF0IjoxNzEzMTk1NTgxLCJleHAiOjE3MTMxOTU1ODB9.CEBGjisp6DOiBy6v0_9IbDoOyNsAO-NbttX7jfyRzf0"
      )
      .send(body);
    assert.equal(res.status, 403);
    assert.equal(
      res.text,
      `{"detail":"Forbidden","service":"AuthToken expired"}`
    );
  });
};
