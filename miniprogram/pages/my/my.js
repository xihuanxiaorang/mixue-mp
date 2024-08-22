const computedBehavior = require('miniprogram-computed').behavior

Page({
  behaviors: [computedBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    mobile: null,
  },

  computed: {
    desensitiveMobile(data) {
      let mobile = data.mobile
      if (mobile) {
        mobile = mobile.replace(/^(\d{3})\d+(\d{2})$/, '$1******$2')
      }
      return mobile
    },
  },

  /**
   * 跳转到登录页面
   */
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const mobile = wx.getStorageSync('mobile')
    if (mobile) {
      this.setData({
        mobile,
      })
    }
  },
})
