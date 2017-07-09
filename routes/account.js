const router = require('koa-router')();
const Account = require('../models/account');

router.prefix('/account');

router.put('/', async (ctx, next) => {
  const money = Number(ctx.request.body.money);
  try {
    const result = await Account.get(ctx.uid);
    if (result[0].balance + money >= 0){
      await Account.update(ctx.uid, money);
      return ctx.body = {
        code: 0,
        msg: money >= 0 ? 'Deposit success' : 'Withdraw money success',
      };
    } else {
      return ctx.body = {
        code: -1,
        msg: 'Balance is not enough',
      };
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: money >= 0 ? 'Deposit error' : 'Withdraw money error',
    };
  }
})

module.exports = router;