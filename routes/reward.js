const router = require('koa-router')();
const moment = require('moment');

const Reward = require('../models/reward');
const Relation = require('../models/relation');

router.prefix('/reward')

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
      result[i].dayTime = moment().format('YYYY-MM-DD');
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
    return ctx.body = {
      code: 0,
      msg: 'Reward success',
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Reward failed',
    }
  }
});

module.exports = router;