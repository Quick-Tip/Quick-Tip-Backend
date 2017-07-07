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
        msg: '验证密码错误',
      }
    }
    let result = await User.getUserByName(userInfo.username);

    if (result.length > 0){
      return ctx.body = {
        code: -1,
        msg: '用户已存在',
      };
    } else {
      if(!(userInfo.username && userInfo.password && userInfo.user_type)){
        return ctx.body = {
          code: -1,
          msg: '用户信息不完整',
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
      if (ctx.token && ctx.userInfo) {
        ctx.body = {
          code: 0,
          msg: '用户注册成功，已自动登录',
          data: {
            token: ctx.token,
            userInfo: ctx.userInfo,
          },
        };
      } else {
        ctx.body = {
          code: -1,
          msg: '验证 token 失败'
        }
      }
    }
  }
  catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: '用户注册失败',
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
        msg: '用户不存在',
      };
    }else{
      if(result[0].password == ctx.request.body.password){
        ctx.request.body.token = jwt.encode({
          id: result[0].uid,
          exp: moment().add(180, "days").valueOf(),
        }, key);
        await next();
        if (ctx.token && ctx.userInfo) {
          ctx.body = {
            code: 0,
            msg: '密码正确, token 验证正确，登录成功',
            data: {
              token: ctx.token,
              userInfo: ctx.userInfo,
            }
          };
        } else {
          ctx.body = {
            code: -1,
            msg: '验证 token 失败'
          }
        }
      }else{
        ctx.body = {
          code: -1,
          msg: '密码错误',
        };
      }
    }
  }
  catch (e) {
    console.log(e);
  }
});

module.exports = router;