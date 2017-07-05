const { asyncQuery } = require('./');

const Account = {};

Account.get = async (uid) => {
  const sql = 'SELECT * FROM account WHERE uid = ?';
  const result = await asyncQuery(sql, [uid]);
  return result;
};

Account.update = async (uid, money) => {
  const sql = 'UPDATE account SET balance = ? WHERE uid = ?';
  const result = await asyncQuery(sql, [money, uid]);
  return result;
};

module.exports = Account;