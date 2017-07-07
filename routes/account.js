const router = require('koa-router')();
const Account = require('../models/account');

router.prefix('/account');

router.get('/', async (ctx, next) => {
  const result = await Account.get(ctx.request.uid);
})

module.exports = Account;