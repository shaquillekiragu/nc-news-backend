const express = require("express");
const app = express();
const healthcheck = require("./controllers/healthcheck.controller");
const { getTopics } = require("./controllers/topics.controller");
const endpointsList = require("./endpoints.json");

app.use(express.json());

app.get("/api/healthcheck", healthcheck);

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsList });
});

app.all("*");

module.exports = app;
