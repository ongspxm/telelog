const fs = require('fs');
const sqlite3 = require('sqlite3');

const dbname = process.env.DB || 'data.db';
const getDb = () => (new sqlite3.Database(dbname,
  err => err ? console.error(err.msg) : ''));

const genError = (msg) => (new Error(msg));

function select(where='', vals=[]) {
  return new Promise((resolve, reject) => {
      const db = getDb();
      db.get(`select * from users ${where}`, vals,
        (err, row) => err ? reject(err) : resolve(row));
      db.close();
  });
}

function writeVal(chatId, username) {
  return new Promise((resolve, reject) => {
      const db = getDb();
      db.run('insert or replace into users(chat_id, username) values(?, ?)', [chatId, username],
        function(err){
          return err ? reject(err) : resolve(this.changes);
        });
      db.close();
  });
}

// -- actual functions
function getChatId(username) {
  return select('where username=?', [username])
  .then(row => row ? row.chat_id : null);
}

function getUsername(username) {
  return select('where chat_id=?', [username])
  .then(row => row ? row.username : null);
}

function updateUsername(chatId, username) {
  return getChatId(username)
  .then(curr => (curr && curr !== chatId)
    ? Promise.reject(genError('username exist'))
    : Promise.resolve)
  .then(() => writeVal(chatId, username))
  .then(row => console.log(row));
}

function setup() {
  const schema = fs.readFileSync('schema.sql').toString();
  getDb().run(schema);
}

module.exports = {
  getChatId, getUsername,
  updateUsername, setup,
};
