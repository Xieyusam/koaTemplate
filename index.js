// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const koajwt = require('koa-jwt')
const bodyParser = require('koa-bodyparser')
const loggerAsync  = require('./middleware/logger-async')
const catchAsync = require('./middleware/catch-async')

// 加载路由中间件
const router = require('./routers')
// 创建一个Koa对象表示web app本身:
const app = new Koa();
app.use(loggerAsync())
app.use(bodyParser())

// 秘钥jwt
const jwtSecret = 'jwtSecret'
app.use(koajwt({ secret: jwtSecret }).unless({
  path: [/^\/login/, /^\/user\/register/],
}))
// catch拦截
app.use(catchAsync())

// 把对应的路由添加
app.use(router.index.routes(), router.index.allowedMethods())
app.use(router.UserRouter.routes(), router.UserRouter.allowedMethods())

// 在端口3000监听:
app.listen(8360);
console.log('app started at port 8360...');