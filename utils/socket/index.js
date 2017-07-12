const WebSocket = require('ws');

let ws;

const initConnect = () => {
  ws = new WebSocket('ws://127.0.0.1:3001', {
    headers: {
      waiter_id: "server"
    }
  });

  ws.on('open', function () {
    ws.send('Connect:');
  });

  ws.on('close', function () {
    initConnect();
  });
};


initConnect();




module.exports = ws;