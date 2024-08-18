import swiper from '../../api/swiper'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    currentIndex: 0,
  },

  onSwiperChange(e) {
    const { current } = e.detail
    this.setData({
      currentIndex: current,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
