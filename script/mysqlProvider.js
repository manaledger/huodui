const mysql = require('mysql');
const Promise = require('bluebird');
const fs = require('fs');
const util = require('util');
const DBProvider = require('./DBProvider');

module.exports = MysqlProvider;
util.inherits(MysqlProvider, DBProvider);

/**
 * Mysql数据导出支持类
 * @param {[type]} config [description]
 */
function MysqlProvider(config) {
    if(!(this instanceof MysqlProvider))
      return new MysqlProvider();
    this.connection = mysql.createConnection(config.connection);
    this.connection.connect();
    DBProvider.call(this, config);
}

/**
 * 实现父类的获取数据方法
 * @return {[type]} [description]
 */
MysqlProvider.prototype.getData = function() {
    var config = this.config;
    var connection = this.connection;

    var order  = config.sortOrder === 1? " ASC " : " DESC ";
    var sql = "select * from "+ config.table +" order by "+ config.sortKey + order + " limit " + config.limit + " offset " + this.lastNo;

    return new Promise(function (resolve, reject) {
      connection.query(sql, function (err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

};

/**
 * 实现父类的清理方法
 * @return {[type]} [description]
 */
MysqlProvider.prototype.clean = function () {
  this.connection.end();
};
