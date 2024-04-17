const db = require("../db/connection");

function fetchArticleById(id) {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1;`, [id])
    .then(({ rows }) => {
      article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return article;
    });
}

module.exports = fetchArticleById;
