const express = require("express");
const app = express();
const healthcheck = require("./controllers/healthcheck.controller");
const getTopics = require("./controllers/topics.controller");
const getApi = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./controllers/articles.controller");
const deleteCommentById = require("./controllers/comments.controller");
const getUsers = require("./controllers/users.controller");

app.use(express.json());

// ENDPOINTS:

app.get("/api/healthcheck", healthcheck);

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

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
