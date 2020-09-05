const socketio = require('socket.io');
const MongoClient = require('mongodb').MongoClient;

const {
  joinRoom,
  sendMessage,
  leaveRoom,
} = require('./actions');

const MONGO_DB_NAME = 'mongo_test';
const MONGO_DB_PSWD = 'IgKLKa3iI8QJlfgk';
const MONGO_USER = 'kmadmin';
const MONGO_HOST = 'cluster0.cvxzn.mongodb.net';
const connectionString = `${MONGO_USER}:${MONGO_DB_PSWD}@${MONGO_HOST}/${MONGO_DB_NAME}`;
const uri = `mongodb+srv://${connectionString}?retryWrites=true&w=majority`;

module.exports = function (server) {
  const mongoClient = new MongoClient(uri, { useNewUrlParser: true });
  const io = socketio(server);

  mongoClient.connect(err => {
    if ( err ) { throw err; }
  
    const collection = mongoClient.db(MONGO_DB_NAME).collection("chatRoom");
  
    io.on('connection', (socket) => {
      socket.on('joinRoom', async (user) => { 
        await joinRoom(io, socket, user, collection);
        // TODO: closing it like this blows up future calls
        // do i need to make a .connect for each DB call and close them independently?
        // do i need to close it after every call?
        // mongoClient.close();
      });
    
      socket.on('sendMessage', async (msg) => { 
        await sendMessage(io, socket, msg, collection);
        // mongoClient.close();
      });
    
      socket.on('disconnect', () => leaveRoom(io, socket.id));
  
      socket.on('clear', (data) => {
        collection.remove({}, () => socket.emit('cleared'));
      });
    });    
  });
};
