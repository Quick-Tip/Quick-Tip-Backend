const { asyncQuery } = require('./');

const NFC = {};

// 商家增加 NFC
// shop_id，desktop_id，data（NFC标签）
NFC.add = async (shopInfo) => {
  try {
    console.log(shopInfo);
    const sql = 'INSERT INTO nfc_bind (shop_id, desktop_id, data) VALUES (?, ?, ?)';
    const values = [shopInfo.shop_id, shopInfo.desktop_id, shopInfo.data];
    const result = await asyncQuery(sql, values);
    return result;
  } catch (e) {
    throw e;
  }
};

// 绑定/解绑服务生
// bind: 0 解绑  1 绑定
NFC.update = async (shop_id, desktop_id, waiter_id, bind) => {
  try {
    let sql;
    let result;
    if (bind == 0){
      sql = 'UPDATE nfc_bind SET waiter_id = null WHERE shop_id = ? AND desktop_id = ? AND waiter_id = ?';
      result = await asyncQuery(sql, [shop_id, desktop_id, waiter_id]);
    } else{
      sql = 'SELECT * FROM nfc_bind WHERE shop_id = ? AND desktop_id = ?';
      result = await asyncQuery(sql, [shop_id, desktop_id]);
      if(result[0].waiter_id != null){
        return {
          code: -1,
          msg: 'This desk has been bound',
        };
      }else{
        sql = 'UPDATE nfc_bind SET waiter_id = ? WHERE shop_id = ? AND desktop_id = ?';
        result = await asyncQuery(sql, [waiter_id, shop_id, desktop_id]);
      }
    }

    return result;
  } catch (e) {
    throw e;
  }

};

NFC.getNFCList = async (uid, utype) => {
  try {
    let sql;
    let values = [uid];
    if(utype == 1){
      sql = 'SELECT * FROM nfc_bind WHERE waiter_id = ?';
    }else if(utype == 2){
      sql = 'SELECT * FROM nfc_bind WHERE shop_id = ?';
    }
    const result = await asyncQuery(sql, values);
    return result;
  } catch (e) {
    throw e;
  }
};

NFC.getDeskInfo = async (shop_id, desktop_id) => {
  try {
    const sql = 'SELECT u1.nickname as waiter_name, u2.nickname as shop_name FROM nfc_bind nfc LEFT JOIN ' +
      'user u2 ON nfc.shop_id = u2.uid  LEFT JOIN user u1 ON nfc.waiter_id = u1.uid' +
      ' WHERE shop_id = ? AND desktop_id = ?';
    const result = await asyncQuery(sql, [shop_id, desktop_id]);
    return result;
  } catch (e){
    throw e;
  }
};

module.exports = NFC;