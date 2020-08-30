const jwt = require('jsonwebtoken');

const fakeUser = {
  id: 1,
  username: 'brad',
  email: 'bradsucks@gmail.com'
};

module.exports = function (app) {
  app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API' });
  });
  
  app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
      if (err) { 
        res.sendStatus(403); 
      } else {
        const msg = { message: 'Post created!', authData };
        res.json(msg);    
      }
    });
  });
  
  app.post('/api/login', (req, res) => {
    const callback = (err, token) => { res.json({ token }); }
    jwt.sign({ fakeUser }, 'secretKey', { expiresIn: '60s' }, callback);
  });  
}

// FORMAT OF TOKEN
// authorization: Bearer <access_token>
function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];

  console.log('asdf', bearerHeader);

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
