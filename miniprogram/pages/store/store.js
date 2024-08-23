Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { value: 'nearby', label: '附近门店' },
      { value: 'recent', label: '常去门店' },
      { value: 'star', label: '收藏门店' },
    ],
    longitude: 0,
    latitude: 0,
    markers: [
      {
        id: 1,
        longitude: '113.032113',
        latitude: 28.190751,
        iconPath: '/assets/images/marker.png',
        width: '53rpx',
        height: '64rpx',
      },
    ],
    mapContext: null,
    collapsed: false,
  },

  /**
   * 收起/展开地图
   */
  collapseMap() {
    const collapsed = !this.data.collapsed
    this.setData({
      collapsed,
    })
  },

  /**
   * 搜索门店
   */
  searchStore() {
    wx.chooseLocation({
      success: (res) => {
        const { longitude, latitude } = res
        this.data.mapContext.moveToLocation({
          longitude,
          latitude,
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  /**
   * 移动到当前用户所在坐标位置
   */
  moveToCurrentLocation() {
    this.data.mapContext.moveToLocation()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocation()
    this.getMapContext()
  },

  /**
   * 获取地图组件的上下文对象
   */
  getMapContext() {
    wx.createSelectorQuery()
      .select('#store-map')
      .context((res) => {
        this.setData({
          mapContext: res.context,
        })
      })
      .exec()
  },

  /**
   * 获取当前用户坐标位置
   */
  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: (res) => {
        const { longitude, latitude } = res
        this.setData({
          longitude,
          latitude,
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },
})
