const request = require('request');

const getLink = endpoint => `https://api.telegram.org/bot${process.env.BOT}/${endpoint}`;

function xhr(uri, qs) {
  return new Promise((resolve, reject) => {
    request({
      uri, qs
    }, (err, data, body) => err
      ? reject(err)
      : resolve(body));
  });
}

function send(chatId, msg) {
  return xhr(getLink('sendMessage'), {
    parse_mode: 'Markdown',
    chat_id: chatId,
    text: msg,
  });
}

function setup(url) {
  return xhr(getLink('setWebhook'), { url });
}

module.exports = {
  send, setup
};
