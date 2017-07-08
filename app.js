const Koa=require('koa');
const app=new Koa();
const json=require('koa-json');
const onerror=require('koa-onerror');
const bodyparser=require('koa-bodyparser');
const logger=require('koa-logger');

let http=require('http')
let server=http.createServer(app.callback());

const index = require('./routes');
const loginCheck = require('./routes/loginCheck');
const user = require('./routes/user/index');
const userUpdate = require('./routes/user/update');
const userRelation = require('./routes/user/relation');

onerror(app);
app.use(bodyparser({
    enableTypes:['json','form','text'],
}));

app.use(json());
app.use(logger());

// Logger
app.use(async (ctx, next)=>{
    const start=new Date();
    await next();
    const ms=new Date()-start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// CORS
app.use(async (ctx, next) => {
   await next();
   ctx.response.set('Access-Control-Allow-Origin', '*');
   ctx.response.set('Access-Control-Allow-Credentials', true);
});

// routes
app.use(user.routes()).use(user.allowedMethods());
app.use(loginCheck.routes()).use(loginCheck.allowedMethods());

app.use(index.routes()).use(index.allowedMethods());
app.use(userUpdate.routes()).use(userUpdate.allowedMethods());
app.use(userRelation.routes()).use(userRelation.allowedMethods());


server.listen(3000);
server.on('listening',onListening);

function onListening(){
    var addr=server.address();
    var bind=typeof addr==='string'?
        'pipe '+addr:
        'port '+addr.port;
    console.log('Listening on '+bind)
}