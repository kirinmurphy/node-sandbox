const connection = require('./connection'); 

function makeQuery (...props) {
  return new Promise ((resolve, reject) => {
    connection.query(...props, (err, result) => {
      if ( err ) return reject(err);
      resolve(result);
    });
  });
}  

module.exports = makeQuery;
