const db = wx.cloud.database()

/**
 * 查询数据库中具有给定电话号码的用户记录
 *
 * @param {string} phone - 用户电话号码
 * @returns {Promise} 返回一个 Promise 对象，解析后的值是查询结果
 */
export const getUserByPhone = (phone) => {
  return db
    .collection('mx_user')
    .where({
      phone,
    })
    .get()
}

/**
 * 从数据库中根据 _id 获取单个用户的记录
 *
 * @param {string} _id - 用户文档的唯一标识符
 * @returns {Promise} - 返回一个 Promise 对象，解析后的值是查询结果
 */
export const getUserById = (_id) => {
  return db.collection('mx_user').doc(_id).get()
}

/**
 * 向数据库中添加新的用户记录
 *
 * @param {Object} userData - 用户数据对象
 * @param {string} userData.phone - 用户电话号码
 * @returns {Promise} - 返回一个 Promise 对象，解析后的值是添加操作的结果
 */
export const create = ({ phone }) => {
  return db.collection('mx_user').add({
    data: {
      phone,
    },
  })
}
