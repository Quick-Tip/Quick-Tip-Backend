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

const asyncQueryWithRollback = (connection, sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err){
        connection.rollback(() => {
          reject(err);
        });
      }

      resolve(results);
    });
  });
};

const asyncTransactionRegister = (sql, values) => {
  return new Promise((resolve, reject) => {
    try{
      pool.getConnection((err, connection) => {
        connection.beginTransaction(async (err) => {

          let result = await asyncQueryWithRollback(connection, sql[0], values[0]);
          values.push([result.insertId]);
          await asyncQueryWithRollback(connection, sql[1], values[1]);

          connection.commit((err) => {
            if (err){
              connection.rollback(() => {
                reject(err);
              });
            }
            console.log('Transaction success!');
            resolve();
          });
        });
        connection.release();
      });
    }
    catch (e) {
      console.log('rollback');
      reject(e);
    }
  });
};

module.exports = { asyncQuery, asyncTransactionRegister };