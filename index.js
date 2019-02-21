const tg = require('./tg');
const dbase = require('./dbase');

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/msg', (req, res) => {
  // u: username, t: text
  const q = req.query;
  dbase.getChatId(q.u)
    .then(chatId => tg.send(chatId, q.t))
    .then(r => res.send(r));
  console.log(req.query);
});

app.get('/hook', (req, res) => {
  tg.setup(`${req.headers.host}/update`)
    .then(console.log);
  res.send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
