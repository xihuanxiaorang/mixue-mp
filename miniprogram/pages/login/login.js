Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 模拟手机号一键登录
   * @param {*} e
   */
  login(e) {
    // TODO 用户同意授权后，将动态令牌code传递给云函数的作为参数，在云函数中使用云调用获取手机号并返回，
    // 具体写法可以参考 https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html#%E4%BA%91%E8%B0%83%E7%94%A8
    const phoneNumber = 13838384388
    wx.setStorageSync('phoneNumber', phoneNumber)
    wx.navigateBack({ delta: 0 })
  },
})
