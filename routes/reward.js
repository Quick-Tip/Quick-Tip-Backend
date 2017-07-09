const router = require('koa-router')();

const Reward = require('../models/reward');
const Relation = require('../models/relation');

router.prefix('/reward')

router.get('/', async (ctx, next) => {
  try {
    let result;
    let timeInfo = {
      start: ctx.query.start == undefined ? 0 : ctx.query.start,
      end: ctx.query.end == undefined ? Date() : ctx.query.start,
    }
    if (ctx.query.waiter != undefined){
      result = await Reward.getList({
        getter: ctx.query.waiter,
        setter: ctx.uid,
      }, timeInfo);
    } else {
      if (ctx.query.shop != undefined){
        const shopWaiter = await Relation.getEmployeeList(ctx.query.shop);
        result = [];
        for (let i = 0; i < shopWaiter.length; i++){
          let tmp = await Reward.getList({
            getter: shopWaiter[i].employee
          }, timeInfo);
          for (let j = 0; j < tmp.length; j++){
            result.push(tmp[j]);
          }
        }
      } else {
        result = await Reward.getList({
          setter: ctx.uid,
        }, timeInfo);
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