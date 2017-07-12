const WebSocket = require('ws');
const jwt = require('jwt-simple');
const moment = require("moment");

const key = require('../encrypt').key;

// websocket 服务器
const wss = new WebSocket.Server({ port: 3001 });
// 服务器中连接的 socket 数组
const waiter = [];

wss.on('connection', function connection(ws, req) {

  ws.on('message', function (msg) {
    console.log(msg);
    // 连接请求
    if(msg.substr(0,8) == 'Connect:'){
      if(msg.length == 8){
        waiter.push({
          id: 'server',
          ws: ws
        });
        // ws.send(`Server connected`);
      }else{
        try{
          let token = msg.substr(8);
          let decode = jwt.decode(token,key);
          let now = moment().valueOf();
          if(now > decode.exp){
            ws.terminate();
          }else{
            waiter.push({
              id: decode.id,
              ws: ws,
            });
            // ws.send(`Waiter ${decode.id} connected`);
          }
        }
        catch(err){
          console.log(err);
          ws.terminate();
        }
      }
    }
    // 打赏请求
    // 发送 服务生号、桌号、金额、评星
    else{
      const info = msg.split(' ');

      const waiter_ws = findWaiter(info[0]);
      if(waiter_ws){
        waiter_ws.send(`Customers give you $${info[2]} as reward in desktop ${info[1]}, score ${info[3]}/5`);
      }else{
        console.log('该服务生尚未连接');
      }
    }
  });


});

findWaiter = (waiter_id) => {
  for(let i = 1; i < waiter.length; i++){
    if(waiter[i].id == waiter_id){
      return waiter[i].ws;
    }
  }
  return null;
};
