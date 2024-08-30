import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/index'

Page({
  behaviors: [storeBindingsBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { value: 'takeaway', label: '自提' },
      { value: 'delivery', label: '外送' },
    ],
    headerStyle: '',
  },

  storeBindings: {
    store: userStore,
    fields: {
      phone: (store) => store.phone,
      desensitivePhone: (store) => store.desensitivePhone,
      nearbyStore: (store) => store.nearbyStore,
    },
    actions: ['updateNearbyStore'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setHeaderStyle()
    !this.data.nearbyStore && this.updateNearbyStore()
  },

  /**
   * 设置头部区域的样式
   */
  setHeaderStyle() {
    const { navigationBarHeight, statusBarHeight } = getApp().globalData
    this.setData({
      headerStyle: `height: ${navigationBarHeight}px;padding-top: ${statusBarHeight}px;`,
    })
  },
})
