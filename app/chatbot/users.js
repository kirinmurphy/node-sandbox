const redis = require('redis');

const client = redis.createClient(process.env.REDISCLOUD_URL);

// reset if server is restarted
// ??? - whats a more elegant way to manage this 
client.flushdb();
console.log('happenin!');

async function addToUsersCollection (id, user) {
  const cachedUsers = await getUsersCache();
  const newCollection = [...cachedUsers, { id, ...user }];
  client.setex("users", 3600, JSON.stringify(newCollection));
}

async function getCurrentUser(id) {
  const cachedUsers = await getUsersCache();
  return cachedUsers.find(user => user.id === id);
}

async function removeFromUsersCollection(leavingUser) {
  const cachedUsers = await getUsersCache();
  const newCollection = cachedUsers.filter(user => user.id !== leavingUser.id);
  client.setex("users", 3600, JSON.stringify(newCollection));
}

async function getRoomUsers (room) {
  const cachedUsers = await getUsersCache();
  return cachedUsers.filter(user => user.room === room);
}

function getUsersCache () {
  return new Promise ((resolve, reject) => {
    client.get("users", (err, result) => {
      if ( err ) { return reject(err); }
      else { resolve(JSON.parse(result) || []); }
    });
  });  
}

module.exports = {
  addToUsersCollection,
  getCurrentUser,
  removeFromUsersCollection,
  getRoomUsers
};
