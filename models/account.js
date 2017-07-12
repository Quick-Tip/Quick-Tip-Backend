const { asyncQuery } = require('./');

const Account = {};

Account.get = async (uid) => {
  try {
    const sql = 'SELECT * FROM account WHERE uid = ?';
    const result = await asyncQuery(sql, [uid]);
    return result;
  } catch (e) {
    throw e;
  }

};

Account.update = async (uid, money) => {
  const sql = 'UPDATE account SET balance = balance + ? WHERE uid = ?';
  const result = await asyncQuery(sql, [money, uid]);
  return result;
};

Account.add = async (uid) => {
  const sql = 'INSERT INTO account (uid) VALUES (?)';
  const result = await asyncQuery(sql, [uid]);
  return result;
}

module.exports = Account;