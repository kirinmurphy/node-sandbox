const connection = require('./app/utils/resourceRouter/connection');

// connection.query('SELECT 1', (err, results) => {
//   if (err) {
//     console.error('Database query error:', err);
//   } else {
//     console.log('Database query results:', results);
//   }
//   connection.end();
// });


async function testIt () {
  try {
    const [results] = await connection.query('SELECT 1');
    if (results.length === 0) {
      console.error('Database query error:', err);
    } else {
      console.log('Database query results:', results);
    }
  } catch (err) {
    console.error('Database query error:', err);
  }
}

testIt();