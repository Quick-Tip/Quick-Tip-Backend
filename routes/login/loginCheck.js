const router=require('koa-router')();
let key=require("../../utils/encrypt").key;
// let userModel=require("../../model").users;
let moment=require("moment");

router.all('*', async (ctx, next) => {
    // ctx.request.uid = 2;
    await next();

    // let token=ctx.header['access-token']
    //     ||(ctx.body && ctx.body.token)
    //     ||(ctx.query && ctx.query.token);
    // if(!token){
    //     return ctx.status=401;
    // }

    // let decode;
    // try{
    //     decode=jwt.decode(token,key);
    //     let now=moment().valueOf();
    //     if(now>decode.exp) return ctx.status=401;
    // }
    // catch(err){
    //     next("token验证无效，请重新登录");
    // }

    // userModel.findOne({
    //     _id:decode.id
    // }).exec((err,data)=>{
    //     if(err) return next(err);
    //     if(!data) return res.status(401).send();
    //     token=jwt.encode({
    //         id:data._id,
    //         exp:moment().add(3,"days").valueOf()
    //     },key);
    //     req.token=token;
    //     req.user=data;
    //     next();
    // })
    //TODO login check
});

module.exports=router;