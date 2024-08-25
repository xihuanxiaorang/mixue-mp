const db = wx.cloud.database()
const command = db.command

/**
 * 查询附近的门店
 *
 * @param {number} longitude - 经度
 * @param {number} latitude - 纬度
 * @param {number} [maxDistance=5000] - 最大查询距离（米），默认为 5000 米
 * @returns {Promise} - 返回一个 Promise，解析为包含附近门店的查询结果
 */
const list = (longitude, latitude, maxDistance = 5000) => {
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
    .limit(10)
    .get()
}

export default {
  list,
}
