const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) { 
      res.sendStatus(403); 
    } else {
      res.json({
        message: 'Post created!',
        authData
      });    
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: 'brad',
    email: 'bradsucks@gmail.com'
  };
  jwt.sign({ user }, 'secretKey', { expiresIn: '30s' }, (err, token) => {
    res.json({ token });
  });
});

// FORMAT OF TOKEN
// authorization: Bearer <access_token>


function verifyToken (req, res, next) {
  // get auth header value 
  const bearerHeader = req.headers['authorization'];
  console.log('asdf', bearerHeader);
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

}

app.listen(5001, () => console.log('Server started on 5001'));
