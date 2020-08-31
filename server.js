const path = require('path');
const http = require('http');
const express = require('express');
const jwt = require('./app/jwt_demo');
const posts = require('./app/posts');

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server);

app.use('/jwt', jwt);

app.use('/posts', posts);

app.use(express.static(path.join(__dirname, './app/public')));

const PORT = process.env.PORT || 5000;
const successMessage = `Server running on port ${PORT}`;
server.listen(PORT, () => console.log(successMessage));
