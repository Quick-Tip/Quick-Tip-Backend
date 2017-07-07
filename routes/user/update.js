const router = require('koa-router')();
const jwt = require('jwt-simple');

const User = require('../../models/user');

router.prefix('/user');

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