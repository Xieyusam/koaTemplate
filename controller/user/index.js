const jwt = require('jsonwebtoken')
const service = require('../../service/user')
const Response = require('../../utils/response')

// 用户登录
async function login(ctx) {
  const { phone, password } = ctx.request.body

  const result = await service.login({ phone, password })
  const response = new Response()
  if (result) {
    const jwtSecret = 'jwtSecret'
    // const tokenExpiresTime = '24h'
    const token = `Bearer ${jwt.sign(phone, jwtSecret)}` // token签名 有效期为1小时
    const { user } = await service.getUserByPhone({ phone })
    response.SUCCESS = 200
    user.password = null
    response.DATA = { token, user }
  } else {
    response.FAIL = 500
    response.DATA = '密码错误或用户不存在'
  }

  ctx.body = response.getData()
}

async function getUserById(ctx) {
    const { id } = ctx.params
    const { user } = await service.getUserById({ ctx, id })
    const response = new Response()

    if(user) {
      response.SUCCESS = 200
      response.DATA = user
    }else{
      response.FAIL = 500
      response.DATA = '用户不存在'
    }
    ctx.body = response.getData()
}

async function newUser(ctx) {
    // FIXME: 新增信息需要添加一个判断, 当前没正式数据, 先 hold住

    // 对用户注册的号码进行判断
    const regPhone = ctx.request.body.phone
    console.log(regPhone)
    const isPhone = await service.getUserByPhone({ phone:regPhone })
    const response = new Response()
    if(isPhone) {
      response.FAIL = 503
      response.DATA = {msg:'该手机号码已经注册'}
      ctx.body = response.getData()
    }else{
      const result = await service.newUser({ ctx })
      if (result.result) {
        response.SUCCESS = 200
        response.DATA = result
      }
      ctx.body = response.getData()
    }
  }
  async function setUser(ctx) {
    const { id } = ctx.params
  
    const result = await service.resetPassword({ ctx, id })
  
    const response = new Response()
    if (result) {
      response.SUCCESS = 200
      response.DATA = '修改成功'
    } else {
      response.FAIL = 500
      response.DATA = '错误'
    }
  
    ctx.body = response.getData()
  }
  
  async function delUser(ctx) {
    const { id } = ctx.params
  
    const result = await service.delUser({ id })
  
    const response = new Response()
  
    if (result) {
      response.SUCCESS = 200
      response.DATA = '删除成功'
    } else {
      response.FAIL = 500
      response.DATA = '删除错误'
    }
    ctx.body = response.getData()
  }
  async function getAllUser(ctx) {
    const result = await service.getAllUser()
    const response = new Response()
    response.SUCCESS = 200
    response.DATA = {count:result.length ,users:result}
    ctx.body = response.getData()
  }
  async function delMoreUser(ctx) {
    console.log(ctx.request.body.id,2)
    ctx.body = ctx.request.body
  }
  async function resetPassword(ctx) {
    const { id } = ctx.request.body
    ctx.request.body.password = "123456"
    const result = await service.resetPassword({ ctx, id })
    const response = new Response()
    if (result) {
      response.SUCCESS = 200
      response.DATA = '修改成功'
    } else {
      response.FAIL = 500
      response.DATA = '错误'
    }
    ctx.body = response.getData()
  }

module.exports = {
    getUserById,
    newUser,
    login,
    setUser,
    delUser,
    getAllUser,
    delMoreUser,
    resetPassword
  }