const { databaseName, mongoClient } = require('../../utils/mongoClient');
const { MONGO_TABLE_MENTIONED_ENTITIES } = require('../constants');

const clients = new Set();

const db = mongoClient.db(databaseName);
const thingsCollection = db.collection(MONGO_TABLE_MENTIONED_ENTITIES);

function initializeServerEvents({ app }) {
  app.get('/events', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.add(res);

    getThings();

    req.on('close', () => {
      clients.delete(res);
    });
  });
}

function pushUpdates(things) {
  const data = `data: ${JSON.stringify(things)}\n\n`;
  clients.forEach(client => {
    client.write(data);
  });
}

async function saveThings(mentionedEntities, roomId) {
  try {
    await thingsCollection.insertMany(mentionedEntities);
    pushUpdates(mentionedEntities);
  } catch (err) {
    console.error('Error saving things:', err);
  }
}

async function getThings() {
  try {
    const mentionedEntities = await thingsCollection.find({}).toArray();
    pushUpdates(mentionedEntities);
  } catch (err) {
    console.error('Error getting things:', err);
    return [];
  }
}

module.exports = {
  initializeServerEvents,
  saveThings
};
