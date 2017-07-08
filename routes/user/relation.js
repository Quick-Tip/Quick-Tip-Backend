const router = require('koa-router')();

const User = require('../../models/user');
const Account = require('../../models/account');
const Relation = require('../../models/relation');

router.prefix('/user/relation');

router.get('/', async (ctx, next) => {
  try {
    const uidResult = await Relation.getEmployeeList(ctx.uid);
    const allInfoResult = [];

    for(let i = 0; i < uidResult.length; i++){
      let nowUser = await User.getUserByID(uidResult[i].employee);
      nowUser = nowUser[0];
      let nowUserBalance = await Account.get(uidResult[i].employee);
      nowUserBalance = nowUserBalance[0].balance;
      allInfoResult.push({
        username: nowUser.username,
        nickname: nowUser.nickname,
        user_type: nowUser.user_type,
        balance: nowUserBalance,
      });
    }
    ctx.body = {
      code: 0,
      msg: 'Access to all employees succeed',
      data: {
        employee: allInfoResult,
      }
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: -1,
      msg: 'Access to all employees failed',
    }
  }
});

router.post('/', async (ctx, next) => {
  try {
    const employeeName = ctx.request.body.employee;

    // 判断用户是否存在
    let result = await User.getUserByName(employeeName);
    if (result.length == 1){
      // 判断用户类型是否是服务生
      if(result[0].user_type != 1){
        return ctx.body = {
          code: -1,
          msg: 'This user isn\'t an employee',
        }
      }
      // 判断服务生是否已被雇佣
      let exist = await Relation.getEmployee(result[0].uid);
      if(exist.length == 1){
        return ctx.body = {
          code: -1,
          msg: 'This employee has been employed',
        }
      }
      await Relation.add(ctx.uid, result[0].uid);

      return ctx.body = {
        code: 0,
        msg: 'Success',
      }
    } else {
      return ctx.body = {
        code: -1,
        msg: 'User dose not exits',
      }
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Add relationship error',
    }
  }
});

router.del('/', async (ctx, next) => {
  try {
    const employeeName = ctx.request.body.employee;

    // 判断用户是否存在
    let result = await User.getUserByName(employeeName);
    if (result.length == 1){
      result = await Relation.delete(ctx.uid, result[0].uid);

      if(result.affectedRows > 0){
        return ctx.body = {
          code: 0,
          msg: 'Delete success',
        }
      }else{
        return ctx.body = {
          code: -1,
          msg: 'Don\'t have employment relationship',
        }
      }

    } else {
      return ctx.body = {
        code: -1,
        msg: 'User dose not exits',
      }
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Delete relationship error',
    }
  }
});


module.exports = router;
