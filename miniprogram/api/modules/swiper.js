const db = wx.cloud.database()

/**
 * 获取首页轮播图列表
 *
 * @returns {Promise} - 返回一个 Promise 对象，解析后的值是查询结果
 */
export const list = () => {
  return db.collection('mx_swiper').get()
}
