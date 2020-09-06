const jwt = require('jsonwebtoken');
const app = require('express');
const router = app.Router();

const fakeUser = {
  id: 1,
  username: 'brad',
  email: 'bradsucks@gmail.com'
};

router.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

router.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) { 
      res.sendStatus(403); 
    } else {
      const msg = { 
        message: 'Post created!', 
        authData,
        timeStamp: req.requestTime 
      };
      
      res.json(msg); 
    }
  });
});

router.post('/api/login', (req, res) => {
  const callback = (err, token) => { res.json({ token }); }
  jwt.sign({ fakeUser }, 'secretKey', { expiresIn: '60s' }, callback);
});  

module.exports = router;

// FORMAT OF TOKEN
// authorization: Bearer <access_token>
function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];

  console.log('bearer header', bearerHeader);

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
