const router = require('koa-router')();

const NFC = require('../models/nfc');

router.prefix('/nfc');

router.get('/', async (ctx, next) => {
  try {
    if(ctx.querystring != ''){
      const result = await NFC.getDeskInfo(ctx.query.shop_id, ctx.query.desktop_id);

      if(result.length == 1 && result[0].waiter_name != null){
        return ctx.body = {
          code: 0,
          msg: 'Get desktop info success',
          data: {
            desktopInfo: {
              waiter_id: result[0].waiter_id,
              shop_name: result[0].shop_name,
              waiter_name: result[0].waiter_name,
            },
          },
        };
      }else{
        return ctx.body = {
          code: -1,
          msg: 'Unbound desk',
        };
      }
    }
    else{
      const result = await NFC.getNFCList(ctx.uid, ctx.utype);

      return ctx.body = {
        code: 0,
        msg: 'Get NFC list success',
        data: {
          nfc: result,
        }
      };
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Get NFC list error',
    };
  }
});

router.post('/', async (ctx, next) => {
  try {
    const nfcInfo = Object.assign(ctx.request.body);
    nfcInfo.shop_id = ctx.uid;

    const result = await NFC.add(nfcInfo);
    if(result.affectedRows == 1){
      return ctx.body = {
        code: 0,
        msg: 'Add NFC success',
      }
    }else{
      return ctx.body = {
        code: -1,
        msg: 'Add NFC error',
      }
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'Add NFC error',
    }
  }
});

router.put('/', async (ctx, next) => {
  try {
    const info = Object.assign(ctx.request.body);
    const result = await NFC.update(info.shop_id, info.desktop_id, ctx.uid, info.bind);
    if(result.code == -1){
      return ctx.body = {
        code: -1,
        msg: 'This desk has been bound'
      }
    }else{
      if(result.affectedRows == 1){
        return ctx.body = {
          code: 0,
          msg: 'success'
        }
      }else{
        return ctx.body = {
          code: -1,
          msg: 'error'
        }
      }
    }

  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: -1,
      msg: 'error',
    }
  }
});


module.exports = router;