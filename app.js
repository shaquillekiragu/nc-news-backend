const express = require("express");
const app = express();
const healthcheck = require("./controllers/healthcheck.controller");
const { getTopics } = require("./controllers/topics.controller");
const getApi = require("./controllers/api.controller");
const getArticleById = require("./controllers/articles.controller");

app.use(express.json());

app.get("/api/healthcheck", healthcheck);

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

// app.all("*");

module.exports = app;
