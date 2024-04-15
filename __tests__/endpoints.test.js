const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/healthcheck", () => {
  test("Checks for a response with the status code of 200", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
});

describe("/api/topics", () => {
  test("GET 200 - Responds with a list of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        topicsArray = body.topics;
        expect(topicsArray).toHaveLength(3);
        topicsArray.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
});

// describe("/api/articles", () => {});

// describe("/api/comments", () => {});

// describe("/api/users", () => {});
