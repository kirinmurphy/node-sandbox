const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.authData = authData;
    next();
  });
}

function redirectIfAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'secretKey', (err, authData) => {
      if (!err) {
        return res.redirect('/home');
      }
    });
  }
  next();
}

module.exports = {
  verifyToken,
  redirectIfAuthenticated
};
