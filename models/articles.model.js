const db = require("../db/connection");
const fetchTopics = require("./topics.model");

function fetchArticleById(article_id) {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
}

function fetchArticles(query) {
  if (Object.keys(query).length === 0) {
    return db
      .query(
        `SELECT articles.*, COUNT(comments.article_id) 
        AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Articles not found" });
        }
        return rows;
      });
  }
  return fetchTopics()
    .then((fetchedRows) => {
      const matchingRows = fetchedRows.filter((row) => {
        return row.slug === query.topic;
      });
      if (!matchingRows.length) {
        return Promise.reject({ status: 404, msg: "Articles not found" });
      }
      const topicInRows = matchingRows[0].slug;
      return db.query(
        `SELECT articles.*, COUNT(comments.article_id) 
    AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE topic = $1
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`,
        [topicInRows]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Articles not found" });
      }
      return rows;
    });
}

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
}

function insertCommentByArticleId(username, body, article_id) {
  return db
    .query(
      `INSERT INTO comments
      (author, body, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateVotesByArticleId(inc_votes, article_id) {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
}

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesByArticleId,
};
