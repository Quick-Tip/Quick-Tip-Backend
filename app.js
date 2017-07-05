const Koa=require('koa');
const app=new Koa();
const json=require('koa-json');
const onerror=require('koa-onerror');
const bodyparser=require('koa-bodyparser');
const logger=require('koa-logger');

let http=require('http')
let server=http.createServer(app.callback());

const index=require('./routes');
const loginCheck=require('./routes/login/loginCheck');

onerror(app);
app.use(bodyparser({
    enableTypes:['json','form','text']
}));

app.use(json());
app.use(logger());

app.use(async (ctx,next)=>{
    const start=new Date();
    await next();
    const ms=new Date()-start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(),index.allowedMethods());
app.use(loginCheck.routes(),loginCheck.allowedMethods());

server.listen(3000);
server.on('listening',onListening);

function onListening(){
    var addr=server.address();
    var bind=typeof addr==='string'?
        'pipe '+addr:
        'port '+addr.port;
    console.log('Listening on '+bind)
}