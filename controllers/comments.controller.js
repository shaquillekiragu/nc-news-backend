const removeCommentById = require("../models/comments.model");

function deleteCommentById(request, response, next) {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then((comment) => {
      response.status(204).send({ comment });
    })
    .catch(next);
}

module.exports = deleteCommentById;
