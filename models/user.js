const { asyncQuery, asyncTransactionRegister } = require('./');

const User = {};

// 将用户信息封装到对象中
User.update = async (username, nickname) => {
  try {
    const sql = 'UPDATE user SET nickname = ? WHERE username = ?';
    const values = [nickname, username];
    const result = await asyncQuery(sql, values);
    return result;
  } catch(e) {
    throw e;
  }


};

// get 可以获取服务者、消费者、商家，因为存在了同一个表中
User.getUserByID = async (uid) => {
  try {
    const sql = 'SELECT * FROM user WHERE uid = ?';
    const result = await asyncQuery(sql, [uid]);
    return result;
  } catch (e) {
    throw e;
  }

};

// get 可以获取服务者、消费者、商家，因为存在了同一个表中
User.getUserByName = async (username) => {
  try {
    const sql = 'SELECT * FROM user WHERE username = ?';
    const result = await asyncQuery(sql, [username]);
    return result;
  } catch (e) {
    throw e;
  }
};

// 用户注册，包含一个添加用户操作和添加账户操作的事务
User.register = async (userInfo) => {
  try {
    const sql = [
      'INSERT INTO user (username, password, nickname, user_type) VALUES (?, ?, ?, ?)',
      'INSERT INTO account (uid) VALUES (?)',
    ];
    const values = [
      [userInfo.username, userInfo.password, userInfo.nickname, userInfo.user_type],
    ];

    const result = await asyncTransactionRegister(sql, values);
    return result;
  } catch(e) {
    throw e;
  }
};

module.exports = User;