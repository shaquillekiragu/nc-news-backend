const { fetchUsers, insertUser } = require("../models/users.model");

function getUsers(request, response, next) {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
}

function postUser(request, response, next) {
  const { username, name, avatar_url } = request.body;
  console.log(username, "<< username controller");
  console.log(name, "<< name controller");
  console.log(avatar_url, "<< avatar_url controller");
  insertUser(username, name, avatar_url)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
}

module.exports = { getUsers, postUser };
