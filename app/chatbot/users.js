let users = [];

function addToUsersCollection (id, user) {
  users = [...users, { id, ...user }];
}

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function removeFromUsersCollection(leavingUser) {
  users = users.filter(user => user !== leavingUser);
}

function getRoomUsers (roomName) {
  return users.filter(user => user.roomData.name === roomName);
}

module.exports = {
  addToUsersCollection,
  getCurrentUser,
  removeFromUsersCollection,
  getRoomUsers
};
