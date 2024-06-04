const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const connection = require('./app/utils/resourceRouter/connection');
const { verifyToken, redirectIfAuthenticated } = require('./app/middlewares/auth');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server);

app.use(express.json());
app.use(cookieParser());

const initializeDatabase = async () => {
  const userResource = require('./app/resources/users');
  const chatRoomsResource = require('./app/resources/chatRooms');
  // Ensure any necessary async initialization is done here
  // For example, create tables if they don't exist
  await userResource.initialize();
  await chatRoomsResource.initialize();
};

// --- AUTHENTICTED ROUTES/PAGES ------------ //
// Endpoint to verify token
app.post('/verify-token', verifyToken, (req, res) => {
  res.sendStatus(200);
});

// Endpoint to get current user info
app.get('/api/users/me', verifyToken, async (req, res) => {
  const userId = req.authData.id;
  const query = 'SELECT username FROM users WHERE id = ?';

  try {
    const [results] = await connection.promise().query(query, [userId]);
    if (results.length === 0) {
      return res.sendStatus(404);
    } else {
      return res.json({ username: results[0].username });
    }
  } catch (err) {
    return res.sendStatus(500);
  }
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



// --- APIS ------------ //
// app.use('/api/chatRooms', require('./app/resources/chatRooms'));

// app.use('/api/users', require('./app/resources/users'));

// app.use('/posts', require('./app/resources/posts'));



// app.use('/jwt', require('./app/jwt_demo'));

app.use(express.static(path.join(__dirname, './app/public')));

app.get('*', (req, res) => { res.redirect('/'); });

initializeDatabase().then(() => {
  server.listen(PORT, () => {
    const PORT = process.env.PORT;
    const successMessage = `Server running on port ${PORT}`;
    server.listen(PORT, () => console.log(successMessage));
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

