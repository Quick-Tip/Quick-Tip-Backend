const router = require('koa-router')();

const User = require('../../models/user');

router.prefix('/user');

router.get('/', async (ctx, next) => {
  ctx.body = {
    code: 0,
    msg: 'Access to the latest information succeed',
  }
})

router.put('/', async (ctx, next) => {
  try {
    const userInfo = ctx.request.body;
    if(!userInfo.username || !userInfo.nickname){
      return ctx.body = {
        code: -1,
        msg: 'Information incomplete',
      };
    }

    const result = await User.update(userInfo.username, userInfo.nickname);
    if (result.affectedRows == 1) {
      return ctx.body = {
        code: 0,
        msg: 'Nickname has been updated',
      }
    } else if (result.affectedRows == 0) {
      return ctx.body = {
        code: -1,
        msg: 'User does not exist',
      }
    } else {
      return ctx.body = {
        code: -1,
        msg: 'More one row error',
      }
    }
  }
  catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Nickname update failed',
    }
  }
});

module.exports = router;