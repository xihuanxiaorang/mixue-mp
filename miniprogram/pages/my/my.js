import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/index'

Page({
  behaviors: [storeBindingsBehavior],

  /**
   * 页面的初始数据
   */
  data: {},

  storeBindings: [
    {
      store: userStore,
      fields: {
        phone: (store) => store.phone,
        desensitivePhone: (store) => store.desensitivePhone,
      },
    },
  ],

  /**
   * 跳转到登录页面
   */
  gotoLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
})
