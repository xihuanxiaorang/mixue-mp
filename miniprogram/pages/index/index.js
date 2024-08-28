import { swiperApi } from '../../api/index'
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/index'

Page({
  behaviors: [storeBindingsBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    currentIndex: 0,
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
    !this.data.nearbyStore && this.updateNearbyStore()
  },
})
