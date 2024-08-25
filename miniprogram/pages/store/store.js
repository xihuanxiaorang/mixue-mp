import storeApi from '../../api/store'
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const computedBehavior = require('miniprogram-computed').behavior
let mapContext
let qqmapsdk

Page({
  behaviors: [computedBehavior],
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
    storeList: [],
    collapsed: false,
  },

  computed: {
    markers(data) {
      return data.storeList.map((store, index) => {
        const { latitude, longitude } = store.position.geopoint
        return {
          id: index,
          title: store.name,
          longitude,
          latitude,
          iconPath: '/assets/images/marker.png',
          width: '53rpx',
          height: '64rpx',
        }
      })
    },
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
        mapContext.moveToLocation({
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
   * 拨打电话号码
   *
   * @param {Object} e - 事件对象
   */
  phoneCall(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({ phoneNumber: phone })
  },

  /**
   * 打开微信内置地图查看位置
   *
   * @param {Object} e - 事件对象
   */
  openLocation(e) {
    const { longitude, latitude } = e.currentTarget.dataset.geopoint
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
    })
  },

  /**
   * 移动地图至当前用户坐标位置
   */
  moveToCurrentLocation() {
    this.moveToLocation(this.data.longitude, this.data.latitude)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.initMapContext()
    this.initQQMapSDK()
    const { longitude, latitude } = await this.getCurrentLocation()
    this.moveToLocation(longitude, latitude)
    this.fetchStoreList(longitude, latitude)
  },

  /**
   * 获取指定坐标位置附近的门店列表数据，按距离从近到远排序
   *
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   */
  async fetchStoreList(longitude, latitude) {
    const { data: storeList } = await storeApi.list(longitude, latitude)
    console.log('原始的门店列表数据：', storeList)
    this.setDeliveryCapabilityForStores(storeList)
    await this.formatStoresWithDistance(storeList)
    console.log('带有是否可外送标志、距离信息并从近到远排序的门店列表数据：', storeList)
    this.setData({ storeList })
  },

  /**
   * 移动地图至指定的地理位置
   *
   * @param {number} longitude - 目的地的经度
   * @param {number} latitude - 目的地的纬度
   */
  moveToLocation(longitude, latitude) {
    if (!mapContext) throw new Error('地图组件上下文没有初始化')
    mapContext.moveToLocation({ longitude, latitude })
  },

  /**
   * 格式化门店列表并添加直线距离信息
   *
   * @param {Array} storeList - 门店列表
   * @returns {Promise<Array>} - 返回一个 Promise，解析为带有直线距离信息并按距离排序的门店列表
   */
  formatStoresWithDistance(storeList = []) {
    if (!qqmapsdk) throw new Error('qqmapsdk 没有初始化')
    // 提取门店列表中的坐标点
    const points = storeList.map((store) => {
      const { latitude, longitude } = store.position.geopoint
      return {
        latitude,
        longitude,
      }
    })
    return new Promise((resolve, reject) => {
      // 计算各门店与指定位置之间的直线距离
      qqmapsdk.calculateDistance({
        mode: 'straight',
        to: points,
        success: (res) => {
          console.log('各门店距离用户当前坐标位置的直线距离：', res.result.elements)
          // 为每个门店添加直线距离信息
          storeList.forEach((store, index) => {
            store.distance = res.result.elements[index].distance
          })
          // 按照距离排序门店列表
          storeList = storeList.sort((a, b) => a.distance - b.distance)
          resolve(storeList)
        },
        fail: (err) => {
          console.error(err)
          reject(err)
        },
      })
    })
  },

  /**
   * 设置每个门店的配送能力标志
   * @param {Array} storeList - 门店列表
   */
  setDeliveryCapabilityForStores(storeList = []) {
    storeList.forEach((store) => {
      store.canDelivery = store.delivery_method.includes('DELIVERY')
    })
  },

  /**
   * 获取用户当前的坐标位置
   */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({ type: 'gcj02' })
        .then((res) => {
          const { longitude, latitude } = res
          console.log('用户当前坐标位置：', longitude, latitude)
          this.setData({ longitude, latitude })
          resolve({ longitude, latitude })
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  /**
   * 初始化腾讯位置服务SDK
   */
  initQQMapSDK() {
    qqmapsdk = new QQMapWX({ key: '3UMBZ-255WH-Z3SDF-WPORT-XZSJS-NYFUY' })
  },

  /**
   * 初始化地图组件的上下文
   */
  initMapContext() {
    wx.createSelectorQuery()
      .select('#store-map')
      .context((res) => {
        mapContext = res.context
      })
      .exec()
  },
})
