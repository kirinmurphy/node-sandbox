require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URL = process.env.MONGODB_URL;

const client = new MongoClient(MONGODB_URL, {
    tls: true,
    tlsAllowInvalidCertificates: true,  // Only for development; remove in production
});

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
}

connectToMongo();

const databaseName = MONGODB_URL.split('/').pop().split('?')[0];

module.exports = {
    mongoClient: client,
    databaseName
};
