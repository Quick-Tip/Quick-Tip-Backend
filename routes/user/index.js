const router = require('koa-router')();
const jwt = require('jwt-simple');
const moment = require("moment");

const key = require("../../utils/encrypt").key;
const User = require('../../models/user');

router.prefix('/user');

// 用户注册
router.post('/register', async (ctx, next) => {
  try {
    const userInfo = ctx.request.body;
    if(userInfo.password !== userInfo.verify){
      return ctx.body = {
        code: -1,
        msg: 'Verify password error',
      }
    }
    let result = await User.getUserByName(userInfo.username);

    if (result.length > 0){
      return ctx.body = {
        code: -1,
        msg: 'User exists',
      };
    } else {
      if(!(userInfo.username && userInfo.password && userInfo.user_type != undefined)){
        console.log(userInfo);
        return ctx.body = {
          code: -1,
          msg: 'Information incomplete',
        };
      }
      if(!userInfo.nickname){
        userInfo.nickname = userInfo.username;
      }

      result = await User.register(userInfo);
      ctx.request.body.token = jwt.encode({
        id: result.insertId,
        exp: moment().add(180, "days").valueOf(),
      }, key);
      await next();
      if (ctx.body) {
        ctx.body.code = 0;
        ctx.body.msg = 'Register success, logining';
      } else {
        ctx.body = {
          code: -1,
          msg: 'Token error'
        }
      }
    }
  }
  catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Register failed',
    };
  }
});

// 用户登录
router.post('/login', async (ctx, next) => {
  try {
    let result = await User.getUserByName(ctx.request.body.username);
    if(result.length == 0){
      ctx.body = {
        code: -1,
        msg: 'User does not exist',
      };
    }else{
      if(result[0].password == ctx.request.body.password && result[0].user_type == ctx.request.body.user_type){
        ctx.request.body.token = jwt.encode({
          id: result[0].uid,
          exp: moment().add(180, "days").valueOf(),
        }, key);
        await next();
        if (ctx.body) {
          ctx.body.code = 0;
          ctx.body.msg = 'Password right, token right，login succeed';
        } else {
          ctx.body = {
            code: -1,
            msg: 'Token error'
          }
        }
      }else{
        ctx.body = {
          code: -1,
          msg: 'Password or Type wrong',
        };
      }
    }
  }
  catch (e) {
    console.log(e);
  }
});

module.exports = router;