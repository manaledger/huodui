const mongoose = require('mongoose');
const Promise = require('bluebird');
const jsonProvider = require('./jsondata');
const fs = require('fs');

module.exports = MongdoData;

function MongdoData(config) {
    mongoose.Promise = Promise;
    this.db = mongoose.connect(config.url);
    this.config = config;
    this.jsonPriver = new jsonProvider(false);
}

MongdoData.prototype.dataFromMongo = function() {
    var config = this.config;
    this.schema = new mongoose.Schema(config.schema, config.schemaOpt);
    var collection = this.db.model('xxx', this.schema);
    var sortOpt = {};
    sortOpt[config.sortKey] = config.sortOrder;
    var contents;
    try{
      contents = JSON.parse(fs.readFileSync(config.recordFile, 'utf8'));
    }catch(e){}
    var lastNo = contents && parseInt(contents['lastNo']) || 0;
    return collection.find().sort(sortOpt).skip(lastNo).limit(config.limit).exec();

};

MongdoData.prototype.transformToJsons = function(array) {
    var i,j,temp;
    var arr = [];
    for (i = 0, j = array.length; i < j; i += this.config.splitCnt){
      temp = array.slice(i, i+this.config.splitCnt);
      arr.push({key:array[i][this.config.sortKey], json:JSON.stringify(temp)});
    }
    this.lastNO = array[array.length-1][this.config.sortKey];

    return arr;
};

MongdoData.prototype.saveToBlockChain = function (array) {
    var promiseArray = [];
    var that = this;
    for (obj of array) {
      promiseArray.push(this.jsonPriver.saveJson(obj.key, obj.json));
    }
    return new Promise(function (resolve, reject) {
      Promise.all(promiseArray).then(function (data) {
        mongoose.disconnect();
        fs.writeFileSync(that.config.recordFile,JSON.stringify({'lastNo': that.lastNO}), 'utf8');
        resolve(data);
      }).catch(function (err) {
        mongoose.disconnect();
        reject(err);
      });
    })
};

MongdoData.prototype.queryAndSave = function () {
  var that = this;
  return that.dataFromMongo().then(function (array) {
    return that.transformToJsons(array);
  }).then(function (array) {
    return that.saveToBlockChain(array);
  });
};
