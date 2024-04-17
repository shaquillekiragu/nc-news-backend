const express = require("express");
const app = express();
const healthcheck = require("./controllers/healthcheck.controller");
const { getTopics } = require("./controllers/topics.controller");
const getApi = require("./controllers/api.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");

app.use(express.json());

// Endpoints

app.get("/api/healthcheck", healthcheck);

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.all("*", (request, response) => {
  response(404).send({ msg: "Endpoint not found" });
});

// Error handling:

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
    response.status(400).send({ msg: "Invalid id" });
  } else if (err.code === "23503") {
    response.status(404).send({ msg: "Not found" });
  }
  next(err);
});

app.use((err, request, response) => {
  response.status(500).send({ message: "internal server error" });
});

module.exports = app;
