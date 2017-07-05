const { asyncQuery } = require('./');

const NFC = {};

// 商家增加 NFC
// shop_id，desktop_id，data（NFC标签）
NFC.add = async (shopInfo) => {
  const sql = 'INSERT INTO nfc_bind (shop_id, desktop_id, data) VALUES (?, ?, ?)';
  const values = [shopInfo.shop_id, shopInfo.desktop_id, shopInfo.data];
  const result = await asyncQuery(sql, values);
  return result;
};

// 绑定/解绑服务生
// 绑定 waitor_id 为 id，解绑为 null
NFC.update = async (data, waitor_id) => {
  const sql = 'UPDATE nfc_bind SET waitor_id = ? WHERE data = ';
  const result = await asyncQuery(sql, [waitor_id, data]);
  return result;
};

module.exports = NFC;