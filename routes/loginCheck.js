const router = require('koa-router')();
const jwt = require('jwt-simple');
const moment = require("moment");

const key = require("../utils/encrypt").key;
const User = require('../models/user');
const Account = require('../models/account');

// token 验证
router.all('*', async (ctx, next) => {
  let token = ctx.header['access-token']
    ||(ctx.request.body && ctx.request.body.token)
    ||(ctx.query && ctx.query.token);
  if(!token){
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
      body = result[0];
      result = await Account.get(decode.id);
      if (result.length == 1) {
        body.balance = result[0].balance;
        ctx.token = jwt.encode({
          id: decode.id,
          exp: moment().add(180, "days").valueOf(),
        }, key);
        ctx.userInfo = {
          username: body.username,
          nickname: body.nickname,
          user_type: body.user_type,
          balance: body.balance,
        };
        await next();
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