const router = require('koa-router')();
const jwt = require('jwt-simple');
const moment = require("moment");

const key = require("../utils/encrypt").key;
const User = require('../models/user');
const Account = require('../models/account');

// crcrcry test token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTUxNTA1MDUwMjY0Mn0.4yCehjFe9Lme9-_CtQjeDOY1kEKZTg0K7aTtcJGmuN8
// crcrcry12 test token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDcsImV4cCI6MTUxNTAzNzAzMDkwMH0.A0ieuds1XKAVAaHzl1CGw87eHte15xtxIJ4Xy3DYfB0
// token 验证
router.all('*', async (ctx, next) => {
  let token = ctx.header['access-token']
    ||(ctx.request.body && ctx.request.body.token)
    ||(ctx.query && ctx.query.token);
  if(!token){
    // token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTUxNTA1MDUwMjY0Mn0.4yCehjFe9Lme9-_CtQjeDOY1kEKZTg0K7aTtcJGmuN8';
    // test
    return ctx.status = 401;
  }

  let decode;
  try{
    decode = jwt.decode(token,key);
    let now = moment().valueOf();
    if(now > decode.exp){
      ctx.status = 401;
      return ;
    }
  }
  catch(err){
    ctx.status = 401;
    return ;
  }

  try {
    let body;
    let result = await User.getUserByID(decode.id);
    if (result.length == 1) {
      // 用户存在且 token 正确
      ctx.uid = decode.id;
      await next();

      // 获取用户当前信息
      result = await User.getUserByID(decode.id);
      body = result[0];
      result = await Account.get(decode.id);
      if (result.length == 1) {
        body.balance = result[0].balance;

        ctx.body = ctx.body || {};
        ctx.body.data = ctx.body.data || {};
        ctx.body.data.token = jwt.encode({
          id: decode.id,
          exp: moment().add(180, "days").valueOf(),
        }, key);
        ctx.body.data.userInfo = {
          username: body.username,
          nickname: body.nickname,
          user_type: body.user_type,
          balance: body.balance,
        };
      } else {
        // 钱包不存在
        ctx.status = 404;
      }
    } else {
      // 用户不存在
      ctx.status = 404;
    }
  } catch (e) {
    // token error
    console.log(e);
    ctx.status = 401;
  }
});

module.exports = router;