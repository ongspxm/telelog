const tg = require('./tg');
const dbase = require('./dbase');

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function sendMsg(body) {
  // u: username, t: text
  return dbase.getChatId(body.u)
    .then(chatId => tg.send(chatId, body.t))
}

app.get('/msg', (req, res) => {
  sendMsg(req.query)
    .then(r => res.send(r));
});

app.post('/msg', (req, res) => {
  sendMsg(req.body)
    .then(r => res.send(r));
});

app.post('/update', (req, res) => {
  const msg = req.body.message;

  const text = msg.text;
  const chatId = msg.chat.id;

  return (text.startsWith('/')
    ? dbase.getUsername(chatId)
      .then(cid => tg.send(chatId, cid ? `*curr*: ${cid}` : 'not set'))
    : dbase.updateUsername(chatId, text)
      .then(
        () => tg.send(chatId, `*updated username:* ${text}`),
        err => tg.send(chatId, `*err:* ${err.message}`)))
  .then(() => res.send());
});

app.get('/hook', (req, res) => {
  const url = `${req.headers.host}/update`;
  tg.setup(url).then(() => res.send(url));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
