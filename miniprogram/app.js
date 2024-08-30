App({
  globalData: {
    /**
     * 胶囊顶部距屏幕顶部距离
     */
    menuBtnTop: 0,
    /**
     * 胶囊高度
     */
    menuBtnHeight: 0,
    /**
     * 状态栏高度
     */
    statusBarHeight: 0,
    /**
     * 导航栏高度
     */
    navigationBarHeight: 0,
  },

  onLaunch: function () {
    this.initCloud()
    this.calculateNavigationBarInfo()
  },

  /**
   * 计算导航栏的高度和其他相关信息
   * 参考自  https://blog.csdn.net/TP19981017/article/details/109147265 & https://blog.csdn.net/qq_43342124/article/details/122148390
   */
  calculateNavigationBarInfo() {
    const { top: menuBtnTop, height: menuBtnHeight } = wx.getMenuButtonBoundingClientRect()
    const { statusBarHeight } = wx.getWindowInfo()
    // 导航栏高度 = (胶囊顶部距屏幕顶部距离 - 状态栏高度) * 2 + 胶囊高度
    const navigationBarHeight = (menuBtnTop - statusBarHeight) * 2 + menuBtnHeight
    this.globalData = Object.assign({}, this.globalData, {
      menuBtnTop,
      menuBtnHeight,
      statusBarHeight,
      navigationBarHeight,
    })
  },

  /**
   * 初始化微信云开发能力
   */
  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
})
