const path = require('path');
const http = require('http');
const express = require('express');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server);

app.use('/jwt', require('./app/jwt_demo'));

app.use('/api/chatRooms', require('./app/resources/chatRooms'));

app.use('/posts', require('./app/resources/posts'));

app.use(express.static(path.join(__dirname, './app/public')));

const PORT = process.env.PORT;
const successMessage = `Server running on port ${PORT}`;
server.listen(PORT, () => console.log(successMessage));
