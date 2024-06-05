const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../utils/resourceRouter/connection');

const userResourceProps = {
  tableName: 'users',
  tableColumns: `(
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (id)
  )`,
  requiredFields: ['username', 'email', 'password'],
  optionalFields: ['created_at', 'updated_at']
};

const userResourceCustomRoutes = [
  {
    method: 'post',
    path: '/signup',
    handler: async (req, res) => {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      try {
        const [results] = await connection.query(query, [username, email, hashedPassword]);
        const token = jwt.sign({ id: results.insertId }, 'secretKey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.json({ success: true });
      } catch (err) {
        console.log('ERRRRR', err);
        return res.json({ success: false, message: 'Signup failed.' });
      }
    }
  },
  {
    method: 'post',
    path: '/login',
    handler: async (req, res) => {
      const { emailOrUsername, password } = req.body;

      const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
      try {
        const [results] = await connection.query(query, [emailOrUsername, emailOrUsername]);
        if (results.length === 0) {
          return res.json({ success: false, message: 'Login failed.' });
        } else {
          const user = results[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.json({ success: true });
          } else {
            return res.json({ success: false, message: 'Login failed.' });
          }
        }
      } catch (err) {
        console.log('ERRRRR', err);
        return res.json({ success: false, message: 'Login failed.' });
      }
    }
  },
  {
    method: 'post',
    path: '/logout',
    handler: (req, res) => {
      res.clearCookie('token');
      return res.json({ success: true });
    }
  }
];

module.exports = {
  userResourceProps,
  userResourceCustomRoutes
};
