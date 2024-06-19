const db = require("../db/connection");

async function removeCommentById(comment_id) {
  const { rows } = await db.query(
    `DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;`,
    [comment_id]
  );
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Comment not found",
    });
  }
  return rows[0];
}

async function updateVotesByCommentId(article_id, comment_id, inc_votes) {
  const query = `
    UPDATE comments
    SET votes = votes + $1
    WHERE article_id = $2 AND comment_id = $3
    RETURNING *;
  `;
  const { rows } = await db.query(query, [inc_votes, article_id, comment_id]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Comment not found",
    });
  }
  return rows[0];
}

module.exports = { updateVotesByCommentId, removeCommentById };
