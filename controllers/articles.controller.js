const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articles.model");

function getArticleById(request, response, next) {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
}

function getArticles(request, response, next) {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
}

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
}

module.exports = { getArticleById, getArticles, getCommentsByArticleId };
