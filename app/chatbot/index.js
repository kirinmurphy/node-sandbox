const socketio = require('socket.io');
const MongoClient = require('mongodb').MongoClient;

const {
  joinRoom,
  sendMessage,
  leaveRoom,
} = require('./actions');


const MONGODB_URL = `${process.env.MONGODB_URL}?retryWrites=true&w=majority`;
const MONGODB_NAME = MONGODB_URL.replace('mongodb+srv://','').split('/')[1].split('?')[0];

module.exports = function (server) {
  const mongoClient = new MongoClient(MONGODB_URL, { useNewUrlParser: true });
  const io = socketio(server);

  mongoClient.connect(err => {
    if ( err ) { throw err; }
  
    const collection = mongoClient.db(MONGODB_NAME).collection("chatRoom");
  
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
