const db = wx.cloud.database()
const command = db.command
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
// 腾讯位置服务申请的key
const key = 'ZCBBZ-VTZ3T-HDOXQ-LC4N6-SAJC6-LMFII'
const qqmapsdk = new QQMapWX({ key })

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
  return new Promise(async (resolve, reject) => {
    try {
      const { data: storeList } = await db
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
      console.log('原始的门店列表数据：', storeList)
      setDeliveryCapabilityForStores(storeList)
      await formatStoresWithDistance(storeList)
      console.log('带有是否可外送标志、距离信息并从近到远排序的门店列表数据：', storeList)
      resolve(storeList)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

/**
 * 格式化门店列表并添加直线距离信息
 *
 * @param {Array} storeList - 门店列表
 * @returns {Promise<Array>} - 返回一个 Promise，解析为带有直线距离信息并按距离排序的门店列表
 */
const formatStoresWithDistance = (storeList = []) => {
  if (!storeList || storeList.length === 0) return
  // 提取门店列表中的坐标点
  const points = storeList.map((store) => {
    const { latitude, longitude } = store.position.geopoint
    return { latitude, longitude }
  })
  return new Promise((resolve, reject) => {
    if (!qqmapsdk) reject('qqmapsdk 没有初始化')
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
}

/**
 * 设置每个门店的配送能力标志
 * @param {Array} storeList - 门店列表
 */
const setDeliveryCapabilityForStores = (storeList = []) => {
  storeList.forEach((store) => {
    store.canDelivery = store.delivery_method.includes('DELIVERY')
  })
}
