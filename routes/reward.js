const router = require('koa-router')();
const moment = require('moment');

const Reward = require('../models/reward');
const Relation = require('../models/relation');
const ws = require('../utils/socket');

router.prefix('/reward');

router.get('/', async (ctx, next) => {
  try {
    let result;
    let timeInfo = {
      start: ctx.query.start || 0,
      end: ctx.query.end || 'NOW()',
    };
    let pageInfo = {
      p: ctx.query.p || undefined,
      psize: ctx.query.psize || undefined,
    };
    if(!pageInfo.p && !pageInfo.psize){
      pageInfo = undefined;
    }else{
      pageInfo.p = Number(pageInfo.p);
      pageInfo.psize = Number(pageInfo.psize);
    }

    let userInfo = {
      getter: ctx.query.waiter,
      nowUserID: ctx.uid,
      nowUserType: ctx.utype,
    };
    result = await Reward.getList(userInfo, timeInfo, pageInfo);

    for(let i = 0; i < result.length; i++){
      // result[i].dayTime = moment(result[i].time).format('YYYY-MM-DD');
      if((Date.now() - result[i].time) > 86400000){
        result[i].dayTime = moment(result[i].time).format('YYYY-MM-DD HH:mm')
      }else{
        result[i].dayTime = moment(result[i].time).fromNow();
      }
    }

    return ctx.body = {
      code: 0,
      msg: 'Get list success',
      data: {
        rewardList: result,
      },
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: 0,
      msg: 'Get list error',
    };
  }
});

router.post('/', async (ctx, next) => {
  try {
    const reqBody = ctx.request.body;
    const rewardInfo = {
      getter: reqBody.getter,
      setter: ctx.uid,
      shop: reqBody.shop,
      star: reqBody.star,
      comment: reqBody.comment,
      money: reqBody.money,
    };
    await Reward.add(rewardInfo);
    ws.send(`${rewardInfo.getter} ${reqBody.desk} ${rewardInfo.money} ${rewardInfo.star}`);

    return ctx.body = {
      code: 0,
      msg: 'Reward success',
    };
  } catch (e) {
    console.log("router:"+e);
    return ctx.body = {
      code: -1,
      msg: 'Reward failed',
    }
  }
});

router.put('/', async (ctx, next) => {
  try {
    const result = await Reward.update(ctx.request.body.id, 1);
    if(result.affectedRows == 1){
      ctx.body = {
        code: 0,
        msg: 'Delete success',
      };
    }else{
      ctx.body = {
        code: -1,
        msg: 'This reward does not exist',
      };
    }
  } catch (e){
    console.log(e);
    ctx.body = {
      code: -1,
      msg: 'Delete error',
    };
  }
});

module.exports = router;