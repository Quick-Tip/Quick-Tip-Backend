const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:3001', {
  headers: {
    waiter_id: "server"
  }
});

ws.on('open', function () {
  ws.send('Connect:');
});

ws.on('message', function (message) {
  console.log(message);
});

ws.on('close', function () {
  ws.resume();
});

module.exports = ws;