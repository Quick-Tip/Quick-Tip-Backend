const router = require('koa-router')();
const User = require('../models/user');

router.get('/',async (ctx, next)=>{
    const result = await User.add({
      username: 'crcrcry',
      password: 'crcrcry',
      nickname: 'cr',
      user_type: '0',
    });
    console.log(result);

    ctx.body = 'hello';
})

module.exports=router;