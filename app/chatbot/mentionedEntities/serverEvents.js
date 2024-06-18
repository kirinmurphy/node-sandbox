const { MONGO_TABLE_MENTIONED_ENTITIES } = require('../constants');
const { getMongoTable } = require('../utils/getMongoTable');

const clients = new Set();

const mentionedEntitiesCollection = getMongoTable(MONGO_TABLE_MENTIONED_ENTITIES);

function initializeServerEvents({ app }) {
  app.get('/events', async (req, res) => {
    const { roomId } = req.query;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.add(res);

    getThings({ roomId });

    req.on('close', () => {
      clients.delete(res);
    });
  });
}

function pushUpdates(things) {
  const data = `data: ${JSON.stringify(things)}\n\n`;
  clients.forEach(client => { client.write(data); });
}

async function saveThings({ mentionedEntities, roomId }) {
  try {
    await mentionedEntitiesCollection.insertMany(mentionedEntities);
    pushUpdates(mentionedEntities);
  } catch (err) {
    console.error('Error saving things:', mentionedEntities, err);
  }
}

async function getThings({ roomId }) {
  console.log('roomId', roomId);
  try {
    const mentionedEntities = await mentionedEntitiesCollection.find({}).toArray();
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
