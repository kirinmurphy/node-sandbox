const path = require('path');
const http = require('http');
const express = require('express');

const chatBot = require('./src/chatbot');
const authenticate = require('./src/jwt_demo');
const loadDb = require('./src/db_demo');

const app = express();
const server = http.createServer(app);

chatBot(server);
authenticate(app);
loadDb(app);

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

const successMessage = `Server running on port ${PORT}`;
server.listen(PORT, () => console.log(successMessage));
