const mysql = require('mysql2');
require('dotenv').config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const trimmedDbUrl = DATABASE_URL.replace('mysql://','').replace('?reconnect=true','');
const [auth, hostAndDb] = trimmedDbUrl.split('@');
const [username, password] = auth.split(':');
const [host, database] = hostAndDb.split('/');

const dbConnection = mysql.createPool({
  host: host,
  user: username,
  password: password,
  database: database,
  connectionLimit: 10
});

dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
  connection.release(); // release the connection back to the pool
});

module.exports = dbConnection;
