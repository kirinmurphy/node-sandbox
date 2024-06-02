require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
    const uri = process.env.MONGODB_URL;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // List databases
        const databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
