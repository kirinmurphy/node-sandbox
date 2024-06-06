require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const connection = require('./app/utils/resourceRouter/connection');
const { verifyToken, redirectIfAuthenticated } = require('./app/middlewares/auth');
const resourceConfig = require('./app/resources/_resourceConfig'); 
const { initializeTable, createResourceRouter } = require('./app/utils/resourceRouter');

const app = express();
const server = http.createServer(app);

require('./app/chatbot')(server);

app.use(express.json());
app.use(cookieParser());

async function initializeResources() {
  for (const resource of resourceConfig) {
    await initializeTable(resource.props);
  }
}

initializeResources().then(() => {
  // --- API ROUTES ------------ //
  for (const resource of resourceConfig) {
    const { props, customRoutes } = resource;
    app.use(resource.endpoint, createResourceRouter(props, customRoutes));
  }

  // --- AUTHENTICTED ROUTES/PAGES ------------ //
  // Endpoint to verify token
  app.post('/verify-token', verifyToken, (req, res) => {
    res.sendStatus(200);
  });

  // get current user info
  app.get('/api/users/me', verifyToken, async (req, res) => {
    const userId = req.authData.id;
    const query = 'SELECT username FROM users WHERE id = ?';

    try {
      console.log('userID', userId);
      const [results] = await connection.query(query, [userId]);
      console.log('!!!!!! results', results);
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

  // app.use('/jwt', require('./app/jwt_demo'));

  app.use(express.static(path.join(__dirname, './app/public')));

  app.get('*', (req, res) => { res.redirect('/'); });

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize resources:', err);
});

