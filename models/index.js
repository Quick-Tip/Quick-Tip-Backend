const mysql = require('mysql');

const mysqlInfo = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'quick_tip',
};

const pool = mysql.createPool(mysqlInfo);

const asyncQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err){
        console.log(`Connect error: ${err}`);
        reject(err);
      } else {
        connection.query(sql, values, (err, results) => {
          if(err){
            console.log(`Execute sql error: ${err}`);
            reject(err);
          }else{
            resolve(results);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = { asyncQuery };