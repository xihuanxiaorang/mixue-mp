import swiperApi from '../../api/swiper'
const computedBehavior = require('miniprogram-computed').behavior

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    currentIndex: 0,
    mobile: '',
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
   * 当轮播图发生切换时调用
   * @param {*} e
   */
  onSwiperChange(e) {
    const { current: currentIndex } = e.detail
    this.setData({
      currentIndex,
    })
  },

  /**
   * 获取轮播图列表数据
   */
  async fetchSwiperList() {
    const { data: swiperList } = await swiperApi.list()
    console.log('轮播图列表数据：', swiperList)
    this.setData({ swiperList })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchSwiperList()
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
