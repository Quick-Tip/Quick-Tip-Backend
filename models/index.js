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
          console.log('roooooollback');
          reject(err);
        });
      }else{
        console.log('resolve result');
        resolve(results);
      }
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
            } else{
              console.log('Transaction success!');
              resolve(result);
            }
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

const asyncTransactionAddReward = (sql, values) => {
  return new Promise((resolve, reject) => {
    try{
      pool.getConnection((err, connection) => {
        connection.beginTransaction(async (err) => {

            for(let i = 0; i < 2; i++){
              await asyncQueryWithRollback(connection, sql[i], values[i]).catch(e => reject(e));
            }
            console.log("rollback continue??");

            connection.commit((err) => {
              if (err){
                connection.rollback(() => {
                  console.log('rrrrrroooooollback');
                  reject(err);
                });
              }else{
                console.log('Transaction success!');
                resolve();
              }
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

module.exports = { asyncQuery, asyncTransactionRegister, asyncTransactionAddReward };