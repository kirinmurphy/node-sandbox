const mysql = require('mysql2');

const DATABASE_URL = process.env.DATABASE_URL || null;
const trimmedDbUrl = DATABASE_URL.replace('mysql://','').replace('?reconnect=true','');

const dbConnection = mysql.createPool({
  user: trimmedDbUrl.split(':')[0],
  password: trimmedDbUrl.split(':')[1].split('@')[0],
  host: trimmedDbUrl.split('@')[1].split('/')[0],
  database: trimmedDbUrl.split('/')[1],
  connectionLimit: 10
});

dbConnection.on('connection', function (connection) {
  console.log('mySql connected...');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });
});

module.exports = dbConnection;
