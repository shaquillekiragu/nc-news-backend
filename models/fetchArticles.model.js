const db = require("../db/connection");
const fetchTopics = require("./topics.model");

async function fetchArticles(query) {
  if (Object.keys(query).length === 0) {
    const { rows } = await db.query(
      `SELECT articles.*, COUNT(comments.article_id) 
          AS comment_count 
          FROM articles 
          LEFT JOIN comments 
          ON articles.article_id = comments.article_id 
          GROUP BY articles.article_id 
          ORDER BY articles.created_at DESC;`
    );
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return rows;
  } else if (query.topic && query.sort) {
    const fetchedRows = await fetchTopics();
    const matchingRows = fetchedRows.filter((row) => {
      return row.slug === query.topic;
    });
    if (!matchingRows.length) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    if (
      query.sort[0] !== "-" &&
      query.sort[0] !== "+" &&
      query.sort[0] !== " "
    ) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const topicInRows = matchingRows[0].slug;
    const validColumns = ["title", "created_at", "votes", "comment_count"];
    const symbol = query.sort[0];

    let queryOne = "articles.created_at";
    if (query.sort.slice(1) === validColumns[0]) {
      queryOne = "articles.title";
    } else if (query.sort.slice(1) === validColumns[2]) {
      queryOne = "articles.votes";
    } else if (query.sort.slice(1) === validColumns[3]) {
      queryOne = "articles.comment_count";
    }

    const queryTwo = symbol === "-" ? "DESC" : "ASC";
    const finalQuery = `${queryOne} ${queryTwo}`;

    const { rows } = await db.query(
      `SELECT articles.*, COUNT(comments.article_id)
            AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            WHERE topic = $1
            GROUP BY articles.article_id
            ORDER BY $2;`,
      [topicInRows, finalQuery]
    );
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return rows;
  } else if (query.topic) {
    const fetchedRows = await fetchTopics();
    const matchingRows = fetchedRows.filter((row) => {
      return row.slug === query.topic;
    });
    if (!matchingRows.length) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    const topicInRows = matchingRows[0].slug;
    const { rows } = await db.query(
      `SELECT articles.*, COUNT(comments.article_id) 
            AS comment_count 
            FROM articles 
            LEFT JOIN comments 
            ON articles.article_id = comments.article_id
            WHERE topic = $1
            GROUP BY articles.article_id 
            ORDER BY articles.created_at DESC;`,
      [topicInRows]
    );
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return rows;
  } else if (query.sort) {
    if (
      query.sort[0] !== "-" &&
      query.sort[0] !== "+" &&
      query.sort[0] !== " "
    ) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const validColumns = ["title", "created_at", "votes", "comment_count"];
    const symbol = query.sort[0];

    let queryOne = "articles.created_at";
    if (query.sort.slice(1) === validColumns[0]) {
      queryOne = "articles.title";
    } else if (query.sort.slice(1) === validColumns[2]) {
      queryOne = "articles.votes";
    } else if (query.sort.slice(1) === validColumns[3]) {
      queryOne = "articles.comment_count";
    }

    const queryTwo = symbol === "-" ? "DESC" : "ASC";
    const finalQuery = `${queryOne} ${queryTwo}`;

    const { rows } = await db.query(
      `SELECT articles.*, COUNT(comments.article_id)
            AS comment_count
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY $1;`,
      [finalQuery]
    );
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return rows;
  } else {
    return Promise.reject({ status: 400, msg: "Model error" });
  }
}

module.exports = fetchArticles;
