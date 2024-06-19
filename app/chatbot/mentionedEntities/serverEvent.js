const { randomUUID } = require('crypto');
const { bindServerSideEvent } = require('../../utils/bindServerSideEvent');
const { MONGO_TABLE_MENTIONED_ENTITIES } = require('../constants');
const { getMongoTable } = require('../utils/getMongoTable');

const clientsMap = new Map();

const mentionedEntitiesCollection = getMongoTable(MONGO_TABLE_MENTIONED_ENTITIES);

function initMentionedEntitiesEvent({ app }) {
  const clientId = randomUUID();
  
  bindServerSideEvent({ 
    app, 
    path: '/events', 
    action: ({ req, res }) => {
      const roomId = Number(req.query.roomId);
      clientsMap.set(clientId, { res, roomId });  
      getSavedEntities({ roomId });  
    }, 
    onClose: () => { clientsMap.delete(clientId); }
  }); 
}

async function saveThings({ mentionedEntities, roomId }) {
  try {
    if ( !mentionedEntities.length ) { return; }
    const formattedEntries = mentionedEntities.map(entity => ({ ...entity, roomId }));
    await mentionedEntitiesCollection.insertMany(formattedEntries);
    pushUpdates({ mentionedEntities: formattedEntries, roomId });
  } catch (err) {
    console.error('Error saving things:', mentionedEntities, err);
  }
}

module.exports = {
  initMentionedEntitiesEvent,
  saveThings
};

async function getSavedEntities({ roomId }) {
  try {
    const mentionedEntities = await mentionedEntitiesCollection.find({ roomId }).toArray();
    pushUpdates({ mentionedEntities, roomId });
  } catch (err) {
    console.error('Error getting things:', err);
    return [];
  }
}

function pushUpdates({ mentionedEntities, roomId: currentRoomId }) {
  const data = `data: ${JSON.stringify(mentionedEntities)}\n\n`;
  clientsMap.forEach(({ res, roomId }) => { 
    if ( currentRoomId === roomId ) { res.write(data); } 
  });
}
