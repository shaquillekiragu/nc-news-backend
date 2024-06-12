const db = require("../db/connection");

function removeCommentById(comment_id) {
  return db
    .query(
      `DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return rows[0];
    });
}

function updateVotesByCommentId(article_id, comment_id, inc_votes) {
  console.log("Hello");
  console.log(inc_votes, "<< inc_votes");
  console.log(article_id, "<< article_id");
  console.log(comment_id, "<< comment_id");
  return db
    .query(
      `UPDATE comments
      SET votes = votes + $1
      FROM articles
      WHERE articles.article_id = $2 AND comments.comment_id = $3
      RETURNING comments.*;`,
      [inc_votes, article_id, comment_id]
    )
    .then(({ rows }) => {
      console.log(rows, "<< rows");
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return rows[0];
    });
}

module.exports = { updateVotesByCommentId, removeCommentById };
