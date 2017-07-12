const router = require('koa-router')();
const jwt = require('jwt-simple');
const moment = require("moment");

const key = require("../utils/encrypt").key;
const User = require('../models/user');
const Account = require('../models/account');
const Relation = require('../models/relation');
const Reward = require('../models/reward');

// token 验证
router.all('*', async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    return ctx.body = 'OPTIONS REQUEST';
  }

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
      // 用户存在且 token 正确
      ctx.uid = decode.id;
      ctx.utype = result[0].user_type;
      await next();

      // 获取用户当前信息
      result = await User.getUserByID(decode.id);
      body = result[0];
      result = await Account.get(decode.id);
      if (result.length == 1) {
        body.balance = result[0].balance;

        if (body.user_type == 1){
          result = await Relation.getEmployee(decode.id);
          // 用户是雇员，且已被雇佣
          if (result.length > 0){
            result = await User.getUserByID(result[0].employer);
            body.employerName = result[0].username;
          }
        } else if(body.user_type == 0){
          body.allRewardMoney = await Reward.getCustomerAllRewardMoney(decode.id);
        }

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
          employerName: body.employerName || '',
          allRewardMoney: body.allRewardMoney,
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