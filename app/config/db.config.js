
// module.exports = {
//   host: 'localhost',
//   user: 'root',
//   password: 'serenity_now',
//   database: 'localNodePracticeDb'
// };

const DATABASE_URL = process.env.DATABASE_URL || null;
const trimmedUrl = DATABASE_URL.replace('mysql://','').replace('?reconnect=true','');

module.exports = {
  user: trimmedUrl.split(':')[0],
  password: trimmedUrl.split(':')[1].split('@')[0],
  host: trimmedUrl.split('@')[1].split('/')[0],
  database: trimmedUrl.split('/')[1]
}
