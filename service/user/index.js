const { mysql } = require('../../database/mysql')
const User = require('../../model/user')
const Uuid = require('../../utils/uuid')
const Crypto = require('../../utils/ctypto')

class UserService {


 // 检查密码是否正确
static async login({ phone, password }) {
  const originPassword = await mysql('user')
    .where({
      phone,
    })
    .select('password')
  if(originPassword.length == 0){ //用户不存在
    return false
  }
  // console.log(Reflect.has(originPassword[0], 'password'))
  if (!Reflect.has(originPassword[0], 'password')) {
    return false
  }

  return new Crypto(password).hash === originPassword[0].password
}
  // 根据id找用户
  static async getUserById({ id }) {
    console.log(id)
  
      const [userInfo] = await mysql('user')
        .where({ id })
        .select()
    if(userInfo) {
      const user = new User(userInfo)
      return user.getData()
    }else{
      return false
    }
  }

  // 注册新用户
  static async newUser({ ctx }) {
    let newUserInfo = {}
    newUserInfo = ctx.request.body

    const user = new User(newUserInfo)
    user.id = new Uuid().uuid
    user.password = new Crypto(user.password).hash
    user.createdDate = new Date()
    // user.updated_date = new Date().getTime()

    // console.log(user.getData().user_with_no_null);

    const result = await mysql('user').insert(user.getData().user)

    return result[0] === 0 ? { result: true, id: user.id } : { result: false }
  }

   
 //以用户电话检索用户信息
static async getUserByPhone({ phone }) {
  let userInfo = {}

  await mysql('user')
    .where({
      phone,
    })
    .select()
    .then((raw) => {
      [userInfo] = raw
    })
    if(userInfo){
      const user = new User(userInfo)
      return user.getData()
    }else{
      return undefined
    }

}
// 用户信息更新
static async setUser({ ctx, id }) {
  let updateUserInfo = {}
  updateUserInfo = ctx.request.body
  const user = new User(updateUserInfo)
  // user.updated_date = new Date().getTime()
  const updateInfo = user.getData().userWithNoNull
  Reflect.deleteProperty(updateInfo, 'created_date')
  Reflect.deleteProperty(updateInfo, 'updated_date')
  const result = await mysql('user').where({id}).update(updateInfo)
  return result === 1
}
// 用户密码充值
static async resetPassword({ ctx, id }) {
  let updateUserInfo = {}
  updateUserInfo = ctx.request.body
  updateUserInfo.password = new Crypto(updateUserInfo.password).hash
  const user = new User(updateUserInfo)
  // user.updated_date = new Date().getTime()
  const updateInfo = user.getData().userWithNoNull
  Reflect.deleteProperty(updateInfo, 'created_date')
  Reflect.deleteProperty(updateInfo, 'updated_date')
  const result = await mysql('user').where({id}).update(updateInfo)
  return result === 1
}
// 删除用户
static async delUser({ id }) {
  const result = await mysql('user')
    .where({ id })
    .del()

  return result === 1
}

  //获取所有用户信息
  static async getAllUser() {
    const result = await mysql('user').select()
    const usersInfo = []
    result.forEach((userInfo) => {
      delete userInfo.password
      usersInfo.push(userInfo)
    })
    return usersInfo
  }

}


module.exports = UserService