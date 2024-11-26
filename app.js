const express = require("express");
const cors = require("cors");
const app = express();

const healthcheck = require("./controllers/healthcheck.controller");
const getTopics = require("./controllers/topics.controller");
const getApi = require("./controllers/api.controller");
const { getUsers, postUser } = require("./controllers/users.controller");
const {
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./controllers/articles.controller");
const {
  patchVotesByCommentId,
  deleteCommentById,
} = require("./controllers/comments.controller");

app.use(express.json());

app.use(cors());

// ENDPOINTS:

app.get("/api/healthcheck", healthcheck);

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/article", postArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.post("/api/users", postUser);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.patch(
  "/api/articles/:article_id/comments/:comment_id",
  patchVotesByCommentId
);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Endpoint not found" });
});

// ERROR HANDLING:

app.use((err, request, response, next) => {
  //   console.log(err, " << error 1");
  //   console.log(err.status, " << error status 1");
  //   console.log(err.msg, " << error msg 1");
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, request, response, next) => {
  //   console.log(err, " << error 2");
  //   console.log(err.code, " << error code 2");
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "Not Found" });
  }
  next(err);
});

app.use((err, request, response) => {
  response.status(500).send({ message: "Internal server error" });
});

module.exports = app;
