const { asyncQuery } = require('./');

const User = {};

// 将用户信息封装到对象中
User.add = async (userInfo) => {
  const sql = 'INSERT INTO user (username, password, nickname, user_type) VALUES (?, ?, ?, ?)';
  const values = [userInfo.username, userInfo.password, userInfo.nickname, userInfo.user_type];
  const result = await asyncQuery(sql, values);
  return result;
};

// get 可以获取服务者、消费者、商家，因为存在了同一个表中
User.getUser = async (uid) => {
  const sql = 'SELECT * FROM user WHERE uid = ?';
  const result = await asyncQuery(sql, [uid]);
  return result;
};


module.exports = User;