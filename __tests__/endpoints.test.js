const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const endpointsList = require("../endpoints.json");

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

describe("/api/nonexistentendpoint", () => {
  test("404 - Endpoint doesn't exist", () => {
    return request(app).get("/api/nonexistentendpoint").expect(404);
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

describe("/api", () => {
  test("GET 200 - Responds with a JSON object containing a list of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsList);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200 - Responds with a single article by article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET 404 - Article not found", () => {
    return request(app).get("/api/articles/999").expect(404);
  });
});

// I took a break from ticket 4 when I was stuck and started ticket 5 below. Went back and finished ticket 4 when I figured it out.

// describe("/api/articles", () => {
//   test("GET 200 - Responds with a list of articles", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then(({ body: { articles } }) => {
//         expect(articles).toHaveLength();
//         articles.forEach((article) => {
//           expect(article).toHaveProperty("author");
//           expect(article).toHaveProperty("title");
//           expect(article).toHaveProperty("article_id", 1);
//           expect(article).toHaveProperty("topic");
//           expect(article).toHaveProperty("created_at");
//           expect(article).toHaveProperty("votes");
//           expect(article).toHaveProperty("article_img_url");
//           expect(article).toHaveProperty("comment_count");
//         });
//       });
//   });
//   test("GET 404 - Articles not found", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(404)
//       .then(({ msg }) => {
//         expect(msg).toEqual("no articles exist");
//       });
//   });
// });
