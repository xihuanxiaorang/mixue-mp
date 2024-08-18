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
})
