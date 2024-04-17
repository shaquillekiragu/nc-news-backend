const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [
      article_id,
    ])
    .then(({ rows }) => {
      article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return article;
    });
}

function fetchArticles() {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      if (!rows) {
        return Promise.reject({ status: 404, msg: "Articles do not exist" });
      }
      return rows;
    });
}

module.exports = { fetchArticleById, fetchArticles };
