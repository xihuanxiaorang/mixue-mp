const db = wx.cloud.database()

/**
 * 获取首页轮播图列表
 */
export const list = () => {
  return db.collection('mx_swiper').get()
}
