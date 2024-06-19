const {
  updateVotesByCommentId,
  removeCommentById,
} = require("../models/comments.model");

async function deleteCommentById(request, response, next) {
  try {
    const { comment_id } = request.params;
    const comment = await removeCommentById(comment_id);
    response.status(204).send({ comment });
  } catch (err) {
    next(err);
  }
}

async function patchVotesByCommentId(request, response, next) {
  try {
    const { article_id, comment_id } = request.params;
    const { inc_votes } = request.body;

    if (
      isNaN(comment_id) ||
      isNaN(article_id) ||
      !inc_votes ||
      typeof inc_votes !== "number"
    ) {
      response.status(400).send({ msg: "Bad Request" });
    }

    const comment = await updateVotesByCommentId(
      article_id,
      comment_id,
      inc_votes
    );
    response.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
}

module.exports = { patchVotesByCommentId, deleteCommentById };
