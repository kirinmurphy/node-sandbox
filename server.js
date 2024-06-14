const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const connection = require('./app/utils/resourceRouter/connection');
const { verifyToken, redirectIfAuthenticated } = require('./app/middlewares/auth');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server, app);

app.use(express.json());
app.use(cookieParser());


// --- AUTHENTICTED ROUTES ------------ //
// Endpoint to verify token
app.post('/verify-token', verifyToken, (req, res) => {
  res.sendStatus(200);
});

// Endpoint to get current user info
app.get('/api/users/me', verifyToken, (req, res) => {
  const userId = req.authData.id;
  const query = 'SELECT username FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.sendStatus(404);
    } else {
      return res.json({ username: results[0].username });
    }
  });
});

app.get('/home', verifyToken, (req, res) => {
  return res.sendFile(path.join(__dirname, './app/public/home.html'));
});

// --- PUBLIC PAGES ------------ //
const publicPaths = [
  { url: '/', file: 'index.html' },
  { url: '/login', file: 'login.html' },
  { url: '/signup', file: 'signup.html' }
];

publicPaths.forEach(({ url, file }) => {
  app.get(url, redirectIfAuthenticated, (req, res) => {
    return res.sendFile(path.join(__dirname, `./app/public/${file}`));
  });
});

app.use('/jwt', require('./app/jwt_demo'));

app.use('/api/chatRooms', require('./app/resources/chatRooms'));

app.use('/posts', require('./app/resources/posts'));

app.use('/api/users', require('./app/resources/users'));

app.use(express.static(path.join(__dirname, './app/public')));

app.get('*', (req, res) => { res.redirect('/'); });

const PORT = process.env.PORT;
const successMessage = `Server running on port ${PORT}`;
server.listen(PORT, () => console.log(successMessage));
