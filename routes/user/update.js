const router = require('koa-router')();

const User = require('../../models/user');
const Relation = require('../../models/relation');

router.prefix('/user');

router.get('/', async (ctx, next) => {
  ctx.body = {
    code: 0,
    msg: 'Access to the latest information succeed',
  }
});

router.get('/star', async (ctx, next) => {
  try {
    const star = await User.getStar(ctx.query.getterID);
    const result = await Relation.getEmployee(ctx.query.getterID);

    ctx.body = {
      code: 0,
      msg: 'Get success'
    };

    ctx.body.data = ctx.body.data || {};
    ctx.body.data.star = star.toFixed(1);

    if(result.length > 0){
      ctx.body.data.nowShop = result[0].nowShop;
    }else{
      ctx.body.data.nowShop = '';
    }

    return ctx.body;
    } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Get error',
    }
  }
});

router.put('/', async (ctx, next) => {
  try {
    const userInfo = ctx.request.body;
    if(userInfo.nickname == undefined){
      return ctx.body = {
        code: -1,
        msg: 'Information incomplete',
      };
    }

    const result = await User.update(ctx.uid, userInfo.nickname);
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