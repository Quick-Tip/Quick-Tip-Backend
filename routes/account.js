const router = require('koa-router')();
const Account = require('../models/account');

router.prefix('/account');

router.put('/', async (ctx, next) => {
  try {

  } catch (e) {
    console.log(e);

  }
})

module.exports = router;