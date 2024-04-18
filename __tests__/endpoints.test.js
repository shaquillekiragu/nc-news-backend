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

// The three skipped 404 error tests below are all attempts to test the Promise.rejects on their respective models, that are checking for cases where the endpoints are inputted correctly and the app and controllers are functioning as they should, but the fetched db data is non existent, or rows is an empty array. I am struggling to test for the error messages matching those in the Promise.rejects, even though I believe I have written my tests as I should. Any pointers?

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
  test.skip("GET 404 - Unable to fetch topics from the correct endpoint", () => {
    return request(app)
      .get("/api/topics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topics do not exist");
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
  test("GET 400 - Invalid id given", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid id");
      });
  });
  test("GET 404 - Article with that id does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article does not exist");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 - Responds with a list of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test.skip("GET 404 - Unable to fetch articles from the correct endpoint", () => {
    return request(app)
      .get("/api/articles")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Articles do not exist");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200 - Responds with a list of an article's comments given an article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        commentsArray = response.body.comments;
        commentsArray.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("GET 400 - Invalid id given", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid id");
      });
  });
  test.skip("GET 404 - Cannot get comments since an article with that id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article does not exist");
      });
  });
});
