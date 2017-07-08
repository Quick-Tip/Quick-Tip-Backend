const router = require('koa-router')();

const Relation = require('../../models/relation');

router.prefix('/user/relation');

router.post('/', async (ctx, next) => {
  try {

  } catch (e) {
    console.log(e);
  }
});


module.exports = router;