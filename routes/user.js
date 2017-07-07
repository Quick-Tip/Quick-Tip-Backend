const router = require('koa-router')();
const User = require('../models/user');

router.prefix('/user');

// 用户注册
router.post('/register', async (ctx, next) => {
  try {
    const userInfo = ctx.request.body;
    let result = await User.getUserByName(userInfo.username);

    if (result.length > 0){
      return ctx.response.body = {
        code: -1,
        msg: '用户已存在',
      };
    } else {
      if(!(userInfo.username && userInfo.password && userInfo.user_type)){
        return ctx.response.body = {
          code: -1,
          msg: '用户信息不完整',
        };
      }
      if(!userInfo.nickname){
        userInfo.nickname = userInfo.username;
      }

      await User.register(userInfo);
      return ctx.response.body = {
        code: 0,
        msg: '用户注册成功',
      };
    }
  }
  catch (e) {
    console.log(e);
    return ctx.response.body = {
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
      ctx.response.body = {
        code: -1,
        msg: '用户不存在',
      };
    }else{
      if(result[0].password == ctx.request.body.password){
        ctx.response.body = {
          code: 0,
          msg: '密码正确',
        };
      }else{
        ctx.response.body = {
          code: -1,
          msg: '密码错误',
        };
      }
    }
    console.log(ctx.response.body);
  }
  catch (e) {
    console.log(e);
  }
});

router.put('/', async (ctx, next) => {
  try {
    const userInfo = ctx.request.body;
    if(!userInfo.username || !userInfo.nickname){
      return ctx.body = {
        code: -1,
        msg: '用户信息不完整',
      };
    }

    const result = await User.update(userInfo.username, userInfo.nickname);
    if (result.affectedRows == 1) {
      return ctx.body = {
        code: 0,
        msg: '用户昵称更新成功',
      }
    } else if (result.affectedRows == 0) {
      return ctx.body = {
        code: -1,
        msg: '该用户名不存在',
      }
    } else {
      return ctx.body = {
        code: -1,
        msg: '影响行数超过一行',
      }
    }
  }
  catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: '用户昵称更新失败',
    }
  }
});

module.exports = router;