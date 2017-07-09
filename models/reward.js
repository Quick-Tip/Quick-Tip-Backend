const { asyncQuery, asyncTransactionAddReward } = require('./');

const Reward = {};

// 根据消费者和服务者，选填，获得打赏信息列表
// 传入参数 { setter, getter, }
Reward.getList = async (userInfo, timeInfo) => {
  let sql = 'SELECT reward_list.id, reward_list.getter as getterID, reward_list.setter, reward_list.money, reward_list.comment, reward_list.star, reward_list.time, reward_list.visible, user.username as getterUsername, user.nickname as getterNickname FROM user JOIN reward_list ON user.uid = reward_list.getter';
  let condition_sql = [];
  let values = [];

  if(userInfo.setter != undefined){
    condition_sql.push(' setter = ?');
    values.push(userInfo.setter);
  }
  if(userInfo.getter != undefined){
    condition_sql.push(' getter = ?');
    values.push(userInfo.getter);
  }
  condition_sql.push(' time >= ?')
  values.push(timeInfo.start);
  condition_sql.push(' time <= ?')
  values.push(timeInfo.end);

  for(let i = 0; i < condition_sql.length; i++){
    if(i != 0){
      sql += ' AND';
    }else{
      sql += ' WHERE';
    }
    sql += condition_sql[i];
  }

  const result = await asyncQuery(sql, values);
  return result;
};

// 增加一个打赏记录
// getter setter star comment money
Reward.add = async (rewardInfo) => {
  try {
    const sql = [
      'UPDATE account SET balance = balance + ? WHERE uid = ?',
      'INSERT INTO reward_list (getter, setter, star, comment, money) VALUES (?, ?, ?, ?, ?)',
    ];
    const values = [
      [rewardInfo.money, rewardInfo.getter],
      [rewardInfo.getter, rewardInfo.setter, rewardInfo.star, rewardInfo.comment, rewardInfo.money],
    ];

    await asyncTransactionAddReward(sql, values);
    return ;
  } catch (e) {
    throw e;
  }

};

// 更新一条打赏记录，设置可见范围
Reward.update = async (id, isVisible) => {
  const sql = 'UPDATE reward_list SET visible = ? WHERE id = ?';
  const result = await asyncQuery(sql, [isVisible, id]);
  return result;
};

module.exports = Reward;