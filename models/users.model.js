const db = require("../db/connection");

async function fetchUsers() {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
}

async function insertUser(username, name, avatar_url) {
  const { rows } = await db.query(
    `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      ($1, $2, $3)
      RETURNING *;`,
    [username, name, avatar_url]
  );
  return rows[0];
}

module.exports = { fetchUsers, insertUser };
