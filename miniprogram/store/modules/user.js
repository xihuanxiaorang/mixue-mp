import { makeAutoObservable } from 'mobx-miniprogram'
import { userApi } from '../../api/index'

class UserStore {
  loginUser = wx.getStorageSync('user')

  constructor() {
    makeAutoObservable(this)
  }

  get phone() {
    return this.loginUser?.phone
  }

  get desensitivePhone() {
    return this.phone?.replace(/^(\d{3})\d+(\d{2})$/, '$1******$2')
  }

  /**
   * 处理用户登录流程
   *
   * @param {string} phone - 用户电话号码
   * @returns {Promise} - 返回一个 Promise 对象，解析后的值表示登录成功时的用户信息
   */
  login(phone) {
    return new Promise(async (resolve, reject) => {
      // 检查电话号码是否为空
      if (!phone) {
        reject('手机号不能为空！')
      }
      try {
        // 查询电话号码对应的用户
        const { data: users } = await userApi.getUserByPhone(phone)
        let loginUser = null
        // 如果找到用户，则使用找到的第一个用户
        if (users && users.length > 0) {
          loginUser = users[0]
        } else {
          // 如果未找到用户，则创建新用户
          const { _id } = await userApi.create({ phone })
          // 查询新创建的用户
          const { data: user } = await userApi.getUserById(_id)
          loginUser = user
        }
        // 保存登录用户信息到全局数据和本地存储
        this.loginUser = loginUser
        wx.setStorageSync('user', loginUser)
        resolve(loginUser) // 登录成功，解析 Promise 为用户信息
      } catch (err) {
        console.error(err)
        reject(err) // 登录失败，拒绝 Promise 并返回错误
      }
    })
  }
}

export const userStore = new UserStore()
