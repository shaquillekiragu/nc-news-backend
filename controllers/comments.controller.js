const {
  updateVotesByCommentId,
  removeCommentById,
} = require("../models/comments.model");

function deleteCommentById(request, response, next) {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then((comment) => {
      response.status(204).send({ comment });
    })
    .catch(next);
}

function patchVotesByCommentId(request, response, next) {
  const { article_id, comment_id } = request.params;
  const { inc_votes } = request.body;

  if (
    isNaN(comment_id) ||
    isNaN(article_id) ||
    !inc_votes ||
    typeof inc_votes !== "number"
  ) {
    return response.status(400).send({ msg: "Bad Request" });
  }

  updateVotesByCommentId(article_id, comment_id, inc_votes)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch(next);
}

module.exports = { patchVotesByCommentId, deleteCommentById };
