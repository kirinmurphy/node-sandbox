const mysql = require('mysql');

const dbConfig = require('../../config/db.config');

const dbConnection = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: 10
});

// connection.connect((err) => {
//   if(err) { throw err; }
//   console.log('Mysql connected...');
// });

dbConnection.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});

module.exports = dbConnection;
