const db = require("../db/connection");

async function fetchTopics() {
  const { rows } = await db.query(`SELECT * FROM topics`);
  return rows;
}

module.exports = fetchTopics;
