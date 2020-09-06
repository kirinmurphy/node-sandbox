const MongoClient = require('mongodb').MongoClient;

const MONGODB_URL = `${process.env.MONGODB_URL}?retryWrites=true&w=majority`;

const databaseName = MONGODB_URL.replace('mongodb+srv://','')
  .split('/')[1].split('?')[0];

// TODO - ??? should there be one mongo client instance used everwhere
// or should each use have it's own mongo client?
const mongoClient = new MongoClient(MONGODB_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})

module.exports = {
  databaseName,
  mongoClient
};
