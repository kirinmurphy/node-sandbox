const path = require('path');
const http = require('http');
const express = require('express');

const jwt = require('./app/jwt_demo');
const posts = require('./app/resources/posts');
const chatRooms = require('./app/resources/chatRooms');
const pushDemo = require('./app/notifications');

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server);

app.use('/jwt', jwt);

app.use('/api/chatRooms', chatRooms);

app.use('/posts', posts);

app.use('/subscribe', pushDemo);

app.use(express.static(path.join(__dirname, './app/public')));

const PORT = process.env.PORT || 5000;
const successMessage = `Server running on port ${PORT}`;
server.listen(PORT, () => console.log(successMessage));
