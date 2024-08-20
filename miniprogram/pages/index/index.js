import swiper from '../../api/swiper'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    currentIndex: 0,
    isLogin: false,
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
   * 加载轮播图数据
   */
  async _loadSwiperList() {
    const { data: swiperList } = await swiper.list()
    this.setData({ swiperList })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._loadSwiperList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const phoneNumber = wx.getStorageSync('phoneNumber')
    if (phoneNumber) {
      this.setData({
        isLogin: true,
      })
    }
  },
})
