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
  const client = new MongoClient(uri, { useNewUrlParser: true });
  const io = socketio(server);

  client.connect(err => {
    if ( err ) { throw err; }
  
    const collection = client.db(MONGO_DB_NAME).collection("chatRoom");
  
    io.on('connection', (socket) => {
      socket.on('joinRoom', (user) => joinRoom(io, socket, user, collection));
    
      socket.on('sendMessage', (msg) => sendMessage(io, socket, msg, collection));
    
      socket.on('disconnect', () => leaveRoom(io, socket.id));
  
      socket.on('clear', (data) => {
        collection.remove({}, () => socket.emit('cleared'));
      });
    });    
  });
};


// collection.insert({ test: 'fongher boylston' }, (err, data) => {
//   console.log('updated', data);

//   const results = collection.find().limit(100).sort({ _id:1 });
//   results.toArray((another, something) => {
//     if (another) throw another;
//     console.log('asdf', something);    
//     client.close();
//   });  
// });  
