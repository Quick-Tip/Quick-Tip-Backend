const { asyncQuery, asyncTransactionAddReward } = require('./');

const Reward = {};

// 获取一个 waiter 在某个店时的特征：
// 总钱数 moneySum
// 总打赏数 numSum
// 平均星级 starAvg
Reward.getWaiterFeature = async (waiter, shop) => {
  try {
    const sql = 'SELECT SUM(money) as moneySum, COUNT(*) as numSum, AVG(star) as starAvg FROM reward_list WHERE getter = ? AND shop = ?';
    const values = [waiter, shop];

    const result = await asyncQuery(sql, values);
    for (let item in result[0]){
      result[0][item] = result[0][item] || 0;
    }
    return result[0];
  } catch (e) {
    throw e;
  }
};

// 根据消费者和服务者，选填，获得打赏信息列表
Reward.getList = async (userInfo, timeInfo, pageInfo) => {
  try {
    let sql = 'SELECT r.id, r.getter as getterID, r.setter as setterID, r.shop as shopID, ' +
      'r.money, r.comment, r.star, r.time, r.visible, ' +
      'u1.nickname as getterNickname, u0.nickname as setterNickname, ' +
      'u2.nickname as shopNickname FROM ' +
      'reward_list r LEFT JOIN user u0 ON r.setter = u0.uid ' +
      'LEFT JOIN user u1 ON r.getter = u1.uid LEFT JOIN user u2 ON r.shop = u2.uid ';
    let condition_sql = [];
    let values = [];

    if(userInfo.getter){
      condition_sql.push(' getter = ?');
      values.push(userInfo.getter);
    }
    if(userInfo.nowUserType == 0){
      condition_sql.push(' setter = ?');
    }else if(userInfo.nowUserType == 2){
      condition_sql.push(' shop = ?');
    }else if(userInfo.nowUserType == 1){
      condition_sql.push(' getter = ?');
    }
    values.push(userInfo.nowUserID);

    condition_sql.push(' time >= ?');
    values.push(timeInfo.start);
    condition_sql.push(' time <= ?');
    values.push(timeInfo.end);

    for(let i = 0; i < condition_sql.length; i++){
      if(i != 0){
        sql += ' AND';
      }else{
        sql += ' WHERE';
      }
      sql += condition_sql[i];
    }
    sql += ' ORDER BY id DESC';
    if(pageInfo){
      sql +=' LIMIT ?, ?';
      values.push(pageInfo.p*pageInfo.psize, pageInfo.psize);
    }

    const result = await asyncQuery(sql, values);
    return result;
  }catch (e) {
    throw e;
  }

};

// 增加一个打赏记录
// getter setter star comment money
Reward.add = async (rewardInfo) => {
  try {
    const sql = [
      'UPDATE account SET balance = balance + ? WHERE uid = ?',
      'INSERT INTO reward_list (getter, setter, shop, star, comment, money) VALUES (?, ?, ?, ?, ?, ?)',
    ];
    const values = [
      [rewardInfo.money, rewardInfo.getter],
      [rewardInfo.getter, rewardInfo.setter, rewardInfo.shop, rewardInfo.star, rewardInfo.comment, rewardInfo.money],
    ];

    await asyncTransactionAddReward(sql, values);
    return ;
  } catch (e) {
    throw e;
  }
};

// 更新一条打赏记录，设置可见范围
Reward.update = async (id, isVisible) => {
  try {
    const sql = 'UPDATE reward_list SET visible = ? WHERE id = ?';
    const result = await asyncQuery(sql, [isVisible, id]);
    return result;
  }catch (e){
    throw e;
  }
};

module.exports = Reward;