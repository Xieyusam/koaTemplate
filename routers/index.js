const Router = require('koa-router')
// 引入路由模块
const user = require('../controller/user')


// 首页路由
const index = new Router()

// TODO: 用户相关路由
const UserRouter = new Router()
UserRouter.get('/user/:id', user.getUserById)
UserRouter.post('/user/register', user.newUser)
UserRouter.post('/login', user.login)
UserRouter.put('/user/:id', user.setUser)
UserRouter.del('/user/:id', user.delUser)
UserRouter.get('/AllUser', user.getAllUser)
UserRouter.post('/delMoreUser', user.delMoreUser)
UserRouter.post('/resetPassword', user.resetPassword)



module.exports = {
    index, UserRouter
}