const db = require("../db/connection");

async function fetchArticleById(article_id) {
  const { rows } = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;`,
    [article_id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
  return rows[0];
}

async function insertArticle(
  title,
  topic,
  username,
  body,
  created_at,
  votes,
  article_img_url
) {
  const { rows } = db.query(
    `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`,
    [title, topic, username, body, created_at, votes, article_img_url]
  );
  return rows[0];
}

async function fetchCommentsByArticleId(article_id) {
  const { rows } = await db.query(
    `SELECT comment_id, votes, created_at, author, body, article_id 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC`,
    [article_id]
  );
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
  return rows;
}

async function insertCommentByArticleId(username, body, article_id) {
  const { rows } = await db.query(
    `INSERT INTO comments
      (author, body, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING *;`,
    [username, body, article_id]
  );
  return rows[0];
}

async function updateVotesByArticleId(inc_votes, article_id) {
  const { rows } = await db.query(
    `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
    [inc_votes, article_id]
  );
  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Article not found",
    });
  }
  return rows[0];
}

module.exports = {
  fetchArticleById,
  insertArticle,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateVotesByArticleId,
};
