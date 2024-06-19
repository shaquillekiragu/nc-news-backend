const {
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesByArticleId,
} = require("../models/articles.model");
const fetchArticles = require("../models/fetchArticles.model");

async function getArticleById(request, response, next) {
  try {
    const { article_id } = request.params;
    const article = await fetchArticleById(article_id);
    response.status(200).send({ article });
  } catch (err) {
    next(err);
  }
}

async function getArticles(request, response, next) {
  try {
    const query = request.query;
    const articles = await fetchArticles(query);
    response.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticleId(request, response, next) {
  try {
    const { article_id } = request.params;
    const comments = await fetchCommentsByArticleId(article_id);
    response.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
}

async function postCommentByArticleId(request, response, next) {
  try {
    const { article_id } = request.params;
    const { username, body } = request.body;
    const comment = await insertCommentByArticleId(username, body, article_id);
    response.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
}

async function patchVotesByArticleId(request, response, next) {
  try {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    const article = await updateVotesByArticleId(inc_votes, article_id);
    response.status(200).send({ article });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
};
