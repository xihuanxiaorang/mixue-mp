const db = wx.cloud.database()
const command = db.command

/**
 * 获取指定坐标位置附近的门店列表数据
 *
 * @param {number} longitude - 经度
 * @param {number} latitude - 纬度
 * @param {number} [limit=10] - 返回的最大门店数量（默认为 10）
 * @param {number} [maxDistance=5000] - 最大搜索距离（米，默认为 5000 米）
 * @returns {Promise} - 返回一个 Promise 对象，解析后的值是查询结果
 */
export const list = (longitude, latitude, limit = 10, maxDistance = 5000) => {
  return db
    .collection('mx_store')
    .where({
      position: {
        geopoint: command.geoNear({
          geometry: db.Geo.Point(longitude, latitude),
          maxDistance,
        }),
      },
    })
    .limit(limit)
    .get()
}
