const connection = require('../connection');

function makeQuery (props, res = null) {
  return new Promise ((resolve, reject) => {
    connection.query(...props, (err, result) => {
      if ( !err ) { return resolve(result); }
      else if ( res ) { res.status(500).send(`Something went wrong :/`); }
      else { return reject(err); }
    });
  });
}

module.exports = { makeQuery };