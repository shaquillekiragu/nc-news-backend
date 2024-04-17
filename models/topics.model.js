const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "Topics do not exist" });
    }
    return rows;
  });
}

module.exports = { fetchTopics };
