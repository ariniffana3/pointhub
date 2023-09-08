const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017/pointhub";
let db = null;

async function connect() {
  if (db === null) {
    const client = await MongoClient.connect(url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    db = client.db();
  }
  return db;
}

module.exports = { connect };
