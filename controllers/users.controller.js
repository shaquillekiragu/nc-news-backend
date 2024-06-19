const { fetchUsers, insertUser } = require("../models/users.model");

async function getUsers(request, response, next) {
  try {
    const users = await fetchUsers();
    response.status(200).send({ users });
  } catch (err) {
    next(err);
  }
}

async function postUser(request, response, next) {
  try {
    const { username, name, avatar_url } = request.body;
    const user = await insertUser(username, name, avatar_url);
    response.status(201).send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, postUser };
