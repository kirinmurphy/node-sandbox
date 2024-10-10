const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'secretKey-MOVE-TO-ENV';
const REFRESH_TOKEN_SECRET = 'refresh-secret-MOVE-TO_ENV';


function verifyToken(req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if ( !accessToken ) {
    if ( !refreshToken ) {
      return res.status(401).json({ message: 'No token provided' });
    }
    return refreshAccessToken(req, res, next);
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, authData) => {
    if (err) {
      if ( err.name === 'TokenExpiredError' && refreshToken ) {
        return refreshAccessToken(req, res, next);
      }
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.authData = authData;
    next();
  });
}

const authCookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
}

const jwtMaxAge = 15 * 60 * 1000;

function setAuthCookies ({ res, userId }) {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  res.cookie('accessToken', accessToken, { ...authCookieDefaults, maxAge: jwtMaxAge });

  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  res.cookie('refreshToken', refreshToken, { ...authCookieDefaults, maxAge: 7 * 24 * 360 * 1000 });
}

function refreshAccessToken (req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, authData) => {
    if ( err ) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ id: authData.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.cookie('accessToken', accessToken, { ...authCookieDefaults, maxAge: jwtMaxAge });
    req.authData = authData;
    next();
  });
}

function redirectIfAuthenticated(req, res, next) {
  const token = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, authData) => {
      if (!err) {
        return res.redirect('/home');
      }
    });
  }
  next();
}

module.exports = {
  verifyToken,
  redirectIfAuthenticated,
  setAuthCookies
};
