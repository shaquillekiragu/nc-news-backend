const fetchTopics = require("../models/topics.model");

async function getTopics(request, response, next) {
  try {
    const topics = await fetchTopics();
    response.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
}

module.exports = getTopics;
