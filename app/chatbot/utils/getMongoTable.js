const { databaseName, mongoClient } = require('../../utils/mongoClient');

function getMongoTable(tableName) {
  const db = mongoClient.db(databaseName);
  return db.collection(tableName);
}

module.exports = { getMongoTable };
