/* eslint-disable no-console */
/* eslint-disable func-names */
const verify = require('../utils/verify')
const Response = require('../utils/response')
const jwtSecret = 'jwtSecret'

function log(ctx) {
  console.log(ctx.method, ctx.header.host + ctx.url)
}

module.exports = function () {
  return async function (ctx, next) {
    const response = new Response()

    log(ctx)
    // console.log(ctx.url)
    if (!ctx.url.includes('/login') && !ctx.url.includes('/user/register')) {

      const {
        authorization
      } = ctx.header
      if (authorization) {
        try {
          const username = await verify(authorization.split(',')[0].split(' ')[1], jwtSecret)
          console.log(username,1)
          // console.log(Reflect.deleteProperty(ctx.request.header, 'authorization'))
          ctx.body = {
            phone: username
          }
          await next()
        } catch (error) {
          response.FAIL = 500
          response.DATA = error
          ctx.body = response.getData()
        }

      } else {
        response.FAIL = 500
        response.DATA = '无token'
        ctx.body = response.getData()
      }

    } else {
      log(ctx)
      await next()
    }
  }
}