const request = require('request');

const getLink = endpoint => `https://api.telegram.org/bot${process.env.BOT}/${endpoint}`;

function send(chatId, msg) {
  return request({
    uri: getLink('sendMessage'),
    qs: {
      parse_mode: 'Markdown',
      chat_id: chatId,
      text: msg,
    },
  });
}

function setup(url) {
  return request({
    uri: getLink('setWebhook'),
    qs: { url },
  });
}

module.exports = {
  send, setup
};
