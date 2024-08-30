import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { storeApi } from '../../api/index'
import { userStore } from '../../store/index'
const computedBehavior = require('miniprogram-computed').behavior
const chooseLocation = requirePlugin('chooseLocation')
let mapContext

Page({
  behaviors: [storeBindingsBehavior, computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { value: 'nearby', label: '附近门店' },
      { value: 'recent', label: '常去门店' },
      { value: 'star', label: '收藏门店' },
    ],
    storeList: [],
    collapsed: false,
    storeDetailPopupShow: false,
    currentStore: null,
  },

  storeBindings: [
    {
      store: userStore,
      fields: {
        currentLocation: (store) => store.currentLocation,
      },
      actions: ['updateCurrentLocation'],
    },
    // 其他store
  ],

  computed: {
    markers(data) {
      return data.storeList?.map((store, index) => {
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

  onMarkerTap(e) {
    const { markerId } = e.detail
    const store = this.data.storeList[markerId]
    this.setData({
      storeDetailPopupShow: true,
      currentStore: store,
    })
  },

  /**
   * 关闭门店详情弹窗
   */
  closeStoreDetailPopup() {
    this.setData({
      storeDetailPopupShow: false,
      currentStore: null,
    })
  },

  /**
   * 显示门店详情弹窗
   *
   * @param {Object} e - 事件对象
   */
  popupStoreDetail(e) {
    const { store } = e.currentTarget.dataset
    this.setData({
      storeDetailPopupShow: true,
      currentStore: store,
    })
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
    // 腾讯位置服务申请的key
    const key = 'ZCBBZ-VTZ3T-HDOXQ-LC4N6-SAJC6-LMFII'
    const referer = 'mixue-mp'
    const location = JSON.stringify(this.data.currentLocation)
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location,
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
    const { longitude, latitude } = this.data.currentLocation
    this.moveToLocation(longitude, latitude)
    this.fetchStoreList(longitude, latitude)
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
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.chooseLocation()
  },

  /**
   * 处理从地图选点插件返回的选择地点信息
   */
  async chooseLocation() {
    // 获取用户从地图选点插件返回的选择地点信息（点击确认返回选点结果对象，否则返回 null）
    const location = chooseLocation.getLocation()
    // 如果用户选择了地点，则获取附近的门店列表
    if (location) {
      const { longitude, latitude } = location
      const storeList = await this.fetchStoreList(longitude, latitude)
      if (storeList && storeList.length > 0) {
        const store = storeList[0].position.geopoint
        this.moveToLocation(store.longitude, store.latitude)
      } else {
        this.moveToLocation(longitude, latitude)
      }
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.initMapContext()
    const { longitude, latitude } = this.data.currentLocation || (await this.updateCurrentLocation())
    this.fetchStoreList(longitude, latitude)
  },

  /**
   * 获取指定坐标位置附近的门店列表数据，按距离从近到远排序
   *
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @returns {Promise<Array>} - 返回带有是否可外送标志、距离信息并按距离排序的门店列表
   */
  fetchStoreList(longitude, latitude) {
    return new Promise(async (resolve, reject) => {
      try {
        const storeList = await storeApi.list(longitude, latitude)
        this.setData({ storeList })
        resolve(storeList)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
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
