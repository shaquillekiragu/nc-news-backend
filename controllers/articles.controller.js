const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesByArticleId,
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
  const query = request.query;
  fetchArticles(query)
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

function postCommentByArticleId(request, response, next) {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertCommentByArticleId(username, body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
}

function patchVotesByArticleId(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateVotesByArticleId(inc_votes, article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
};
