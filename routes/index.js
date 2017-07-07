const router = require('koa-router')();
const User = require('../models/user');

router.get('/', async (ctx, next)=>{
  ctx.body = 'hello';
});

module.exports = router;