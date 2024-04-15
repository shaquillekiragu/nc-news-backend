const express = require("express");
const app = express();
const healthcheck = require("./controllers/healthcheck.controller");
const { getTopics } = require("./controllers/topics.controller");
// const {} = require("./controllers/articles.controller");
// const {} = require("./controllers/comments.controller");
// const {} = require("./controllers/users.controller");

app.use(express.json());

//Endpoints:

app.get("/api/healthcheck", healthcheck);

app.get("/api/topics", getTopics);

// Error handling:

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "internal server error" });
});

module.exports = app;
