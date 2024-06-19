const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

async function runSeed() {
  try {
    await seed(devData);
    console.log("Seeding completed successfully.");
  } catch (err) {
    console.error("Error during seeding: ", err);
  } finally {
    db.end();
  }
}

runSeed();
