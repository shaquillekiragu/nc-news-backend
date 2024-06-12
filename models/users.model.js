const db = require("../db/connection");

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function insertUser(username, name, avatar_url) {
  // console.log(username, "<< username model");
  // console.log(name, "<< name model");
  // console.log(avatar_url, "<< avatar_url model");
  return db
    .query(
      `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      ($1, $2, $3)
      RETURNING *;`,
      [username, name, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchUsers, insertUser };
