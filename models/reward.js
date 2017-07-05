const { asyncQuery } = require('./');

const Reward = {};

// 根据消费者和服务者，选填，获得打赏信息列表
// 传入参数 { setter, getter, }
Reward.getList = async (userInfo) => {
  let sql = 'SELECT * FROM reward_list';
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
// getter setter star comment money time
Reward.add = async (rewardInfo) => {
  const sql = 'INSERT INTO user (getter, setter, star, comment, money, time) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [rewardInfo.getter, rewardInfo.setter, rewardInfo.star, rewardInfo.comment, rewardInfo.money, rewardInfo.time];
  const result = await asyncQuery(sql, values);
  return result;
};

// 更新一条打赏记录，设置可见范围
Reward.update = async (id, isVisible) => {
  const sql = 'UPDATE reward_list SET visible = ? WHERE id = ?';
  const result = await asyncQuery(sql, [isVisible, id]);
  return result;
};

module.exports = Reward;