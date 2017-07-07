const router = require('koa-router')();
const User = require('../models/user');

router.prefix('/user');

// 用户注册
router.post('/register', async (ctx, next) => {
  const userInfo = ctx.request.body;
  let result = await User.getUserByName(userInfo.username);

  if (result.length > 0){
    ctx.response.body = {
      code: -1,
      msg: '用户已存在',
    };
  } else {
    try {
      await User.register(userInfo);
      ctx.response.body = {
        code: 0,
        msg: '用户注册成功',
      };
    } catch (e) {
      console.log(e);
      ctx.response.body = {
        code: -1,
        msg: '用户注册失败',
      };
    }
  }
});

// 用户登录
router.post('/login', async (ctx, next) => {
  try {
    let result = await User.getUserByName(ctx.request.body.username);

    if(result.length == 0){
      ctx.response.status = 406;
      ctx.response.body = {
        code: -1,
        msg: '用户不存在',
      };
    }else{
      if(result[0].password == ctx.request.body.password){
        ctx.response.status = 200;
        ctx.response.body = {
          code: 0,
          msg: '密码正确',
        };
      }else{
        ctx.response.status = 406;
        ctx.response.body = {
          code: -1,
          msg: '密码错误',
        };
      }
    }
    console.log(ctx.response.body);
  } catch (e) {
    console.log(e);
  }

});

module.exports = router;