// const fetch = require('node-fetch');
const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);



let users = [];

function addToUsersCollection (id, user) {
  const newCollection = [...users, { id, ...user }];
  users = newCollection;
  client.setex("users", 3600, JSON.stringify(newCollection));

}

async function getCurrentUser(id) {
  const cachedUsers = await getUsersCache();
  return cachedUsers.find(user => user.id === id);
}

function removeFromUsersCollection(leavingUser) {
  users = users.filter(user => user !== leavingUser);
}

function getUsersCache () {
  return new Promise ((resolve, reject) => {
    client.get("users", (err, result) => {
      if ( err ) { return reject(err); }
      else { resolve(JSON.parse(result)); }
    });
  });  
}

async function getRoomUsers (room) {
  const cachedUsers = await getUsersCache();
  return cachedUsers.filter(user => user.room === room);
}

module.exports = {
  addToUsersCollection,
  getCurrentUser,
  removeFromUsersCollection,
  getRoomUsers
};
