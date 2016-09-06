const mysql = require('mysql');
const Promise = require('bluebird');
const jsonProvider = require('./jsondata');
const fs = require('fs');

module.exports = MysqlProvider;

function MysqlProvider(config) {
    this.connection = mysql.createConnection(config.connection);
    this.connection.connect();
    this.config = config;
    this.jsonPriver = new jsonProvider(false);
}

MysqlProvider.prototype.dataFromMysql = function() {
    var config = this.config;
    var connection = this.connection;
    var contents;
    try{
      contents = JSON.parse(fs.readFileSync(config.recordFile, 'utf8'));
    }catch(e){}
    var lastNo = contents && parseInt(contents['lastNo']) || 0;
    var order  = config.sortOrder === 1? " ASC " : " DESC ";
    var sql = "select * from "+ config.table +" order by "+ config.sortKey + order + " limit " + config.limit + " offset " + lastNo;

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


MysqlProvider.prototype.transformToJsons = function(array) {
    var i,j,temp;
    var arr = [];
    for (i = 0, j = array.length; i < j; i += this.config.splitCnt){
      temp = array.slice(i, i+this.config.splitCnt);
      arr.push({key:array[i][this.config.sortKey], json:JSON.stringify(temp)});
    }
    this.lastNO = array[array.length-1][this.config.sortKey];

    return arr;
};


MysqlProvider.prototype.saveToBlockChain = function (array) {
    var promiseArray = [];
    var that = this;
    for (obj of array) {
      promiseArray.push(this.jsonPriver.saveJson(obj.key, obj.json));
    }
    return new Promise(function (resolve, reject) {
      Promise.all(promiseArray).then(function (data) {
        that.connection.end();
        fs.writeFileSync(that.config.recordFile,JSON.stringify({'lastNo': that.lastNO}), 'utf8');
        resolve(data);
      }).catch(function (err) {
        that.connection.disconnect();
        reject(err);
      });
    })
};


MysqlProvider.prototype.queryAndSave = function () {
  var that = this;
  return that.dataFromMysql().then(function (array) {
    return that.transformToJsons(array);
  }).then(function (array) {
    return that.saveToBlockChain(array);
  });
};
