const express = require("express");
const app = express();

app.use(express.json());

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, request, response) => {
  response.status(500).send({ message: "internal server error" });
});
