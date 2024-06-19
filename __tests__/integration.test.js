const request = require("supertest");
require("jest-sorted");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
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

describe("/api/topics", () => {
  test("GET 200 - Responds with a list of topics", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(typeof topic.description).toBe("string");
      expect(typeof topic.slug).toBe("string");
    });
  });
});

describe("/api", () => {
  test("GET 200 - Responds with a JSON object containing a list of available endpoints", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsList);
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200 - Responds with a single article by article_id", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);
    expect(article).toHaveProperty("author");
    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("article_id", 1);
    expect(article).toHaveProperty("body");
    expect(article).toHaveProperty("author");
    expect(article).toHaveProperty("topic");
    expect(article).toHaveProperty("votes");
    expect(article).toHaveProperty("article_img_url");
  });
  test("GET 400 - Invalid id given", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/notAnId").expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("GET 404 - Article with that id does not exist", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/999").expect(404);
    expect(msg).toBe("Article not found");
  });
  test("PATCH 200 - Responds with an article with a correctly updated vote count", async () => {
    const {
      body: { article },
    } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200);
    expect(article).toHaveProperty("votes", 150);
    expect(article).toHaveProperty("author");
    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("article_id", 1);
    expect(article).toHaveProperty("body");
    expect(article).toHaveProperty("topic");
    expect(article).toHaveProperty("article_img_url");
  });
  test("PATCH 400 - Empty inc_votes object received", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/articles/1").send({}).expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("PATCH 400 - Failing schema validation", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "string" })
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("PATCH 400 - Invalid id given", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/notAnId")
      .send({ inc_votes: 50 })
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("PATCH 404 - Article with that id does not exist", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 50 })
      .expect(404);
    expect(msg).toBe("Article not found");
  });
  test("GET 200 - Responds with a single article, this time with a comment_count, by article_id ", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);
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

describe("/api/articles", () => {
  test("GET 200 - Responds with a list of articles", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
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
  test("GET 200 - Responds with a list if all articles if no query given after query character", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?").expect(200);
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

describe("/api/articles/:article_id/comments", () => {
  test("GET 200 - Responds with a list of an article's comments given an article_id", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);
    comments.forEach((comment) => {
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.created_at).toBe("string");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.body).toBe("string");
      expect(typeof comment.article_id).toBe("number");
    });
  });
  test("GET 400 - Invalid id given", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/notAnId/comments").expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("POST 201 - Adds a comment to an article, given an article_id", async () => {
    const {
      body: { comment },
    } = await request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Yay, this is the latest comment.",
      })
      .expect(201);
    expect(typeof comment.author).toBe("string");
    expect(typeof comment.body).toBe("string");
    expect(comment).toHaveProperty("author", "butter_bridge");
    expect(comment).toHaveProperty("body", "Yay, this is the latest comment.");
  });
  test("POST 400 - Empty comment object received", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("POST 400 - Failing schema validation", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204 - Responds with a 204 status code for the deleted comment with the given comment_id", async () => {
    await request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE 400 - Invalid id given", async () => {
    const {
      body: { msg },
    } = await request(app).delete("/api/comments/notAnId").expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("DELETE 404 - Comment with that id does not exist", async () => {
    const {
      body: { msg },
    } = await request(app).delete("/api/comments/999").expect(404);
    expect(msg).toBe("Comment not found");
  });
});

describe("/api/articles/:article_id/comments/:comment_id", () => {
  test("PATCH 200 - Responds with a comment with a correctly updated vote count", async () => {
    const {
      body: { comment },
    } = await request(app)
      .patch("/api/articles/9/comments/1")
      .send({ inc_votes: 1 })
      .expect(200);
    expect(comment).toHaveProperty("body");
    expect(comment).toHaveProperty("votes", 17);
    expect(comment).toHaveProperty("author");
    expect(comment).toHaveProperty("article_id");
    expect(comment).toHaveProperty("created_at");
  });
  test("PATCH 400 - Empty inc_votes object received", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/9/comments/1")
      .send({})
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("PATCH 400 - Failing schema validation", async () => {
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/9/comments/1")
      .send({ inc_votes: "string" })
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
});

describe("/api/users", () => {
  test("GET 200 - Responds with a list of all users", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(typeof user.username).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
    });
  });
  test("POST 201 - Adds a user to the database, given inputted information from the user", async () => {
    const {
      body: { user },
    } = await request(app)
      .post("/api/users")
      .send({
        username: "shaqk",
        name: "Shaq K",
        avatar_url: "https://a.com/random/url",
      })
      .expect(201);
    expect(user).toHaveProperty("username", "shaqk");
    expect(user).toHaveProperty("name", "Shaq K");
    expect(user).toHaveProperty("avatar_url", "https://a.com/random/url");
  });
  test("POST 201 - Adds a user to the database, given inputted information from the user, allowing for no given avatar_url", async () => {
    const {
      body: { user },
    } = await request(app)
      .post("/api/users")
      .send({
        username: "shaqk",
        name: "Shaq K",
        avatar_url: "",
      })
      .expect(201);
    expect(user).toHaveProperty("username", "shaqk");
    expect(user).toHaveProperty("name", "Shaq K");
    expect(user).toHaveProperty("avatar_url", "");
  });
  test("POST 400 - Empty user object received", async () => {
    const {
      body: { msg },
    } = await request(app).post("/api/users").send({}).expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("POST 400 - Failing schema validation", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/users")
      .send({ username: "shaqk" })
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
});

describe("/api/articles?topic=", () => {
  test("GET 200 - Responds with a list of articles with a topic value of mitch", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?topic=mitch").expect(200);
    articles.forEach((article) => {
      expect(article).toHaveProperty("topic", "mitch");
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("article_img_url");
    });
  });
  test("GET 404 - Invalid query value given. No article with that topic", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles?topic=nonExistent").expect(404);
    expect(msg).toBe("Articles not found");
  });
});

describe("/api/articles?sort=", () => {
  test("GET 200 - Responds with a list of articles sorted by the specified column and order", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?sort=+title").expect(200);
    expect(articles).toBeSorted("title", { ascending: true });
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
  test("GET 400 - Invalid query value given. Unable to sort articles with sort query without a query value", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles?sort=nonExistent").expect(400);
    expect(msg).toBe("Bad request");
  });
});

describe("/api/articles?topic=&sort=", () => {
  test("GET 200 - Responds with a list of articles sorted by the specified column and order", async () => {
    const {
      body: { articles },
    } = await request(app)
      .get("/api/articles?topic=mitch&sort=+title")
      .expect(200);
    expect(articles).toBeSorted("title", { ascending: true });
    articles.forEach((article) => {
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("topic", "mitch");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("votes");
      expect(article).toHaveProperty("article_img_url");
      expect(article).toHaveProperty("comment_count");
    });
  });
  test("GET 404 - Invalid query value given. No article with that topic", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/articles?topic=nonExistent&sort=+title")
      .expect(404);
    expect(msg).toBe("Articles not found");
  });
  test("GET 400 - Invalid query value given. Unable to sort articles with sort query without a query value", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/articles?topic=mitch&sort=nonExistent")
      .expect(400);
    expect(msg).toBe("Bad request");
  });
  test("GET 404 - Invalid query value given. No article with that topic. Also unable to sort articles with sort query without a query value", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/articles?topic=nonExistent&sort=nonExistent")
      .expect(404);
    expect(msg).toBe("Articles not found");
  });
});
