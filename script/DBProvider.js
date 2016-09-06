const Promise = require('bluebird');
const jsonProvider = require('./jsondata');
const fs = require('fs');

module.exports = DBProvider;

/**
 * 数据库访问抽象类，传入配置项初始化
 * @param {object} config 配置选项列表
 */
function DBProvider(config) {
    this.config = config;
    this.jsonPriver = new jsonProvider(false);
    var contents;
    try {
        contents = JSON.parse(fs.readFileSync(config.recordFile, 'utf8'));
    } catch (e) {}
    this.lastNo = contents && parseInt(contents['lastNo']) || 0;
    this.lastNoChange = false;
}

/**
 * 获取数据，必须由子类实现
 * @return {[type]} [description]
 */
DBProvider.prototype.getData = function() {
    throw new Error('not implementing getData ...');
};

/**
 * 清理函数，必须由子类实现
 * @return {[type]} [description]
 */
DBProvider.prototype.clean = function() {
    throw new Error('not implementing clean  ...');
};

/**
 * 将数据库查询出来的数据转换成JSON列表形式
 * @param  {array} array 数据库查询结果
 * @return {araay}       转换后的数组，每个元素是一个对象，由key和json项组成
 */
DBProvider.prototype.transformToJsons = function(array) {
    var i, j, temp;
    var arr = [];
    if (array.length > 0) {
        for (i = 0, j = array.length; i < j; i += this.config.splitCnt) {
            temp = array.slice(i, i + this.config.splitCnt);
            arr.push({
                key: array[i][this.config.sortKey],
                json: JSON.stringify(temp)
            });
        }
        this.lastNo = array[array.length - 1][this.config.sortKey];
        this.lastNoChange = true;
    }

    return arr;
};

/**
 * 将JSON数组写入到区块链中
 * @param  {array}  array 数组，每个元素是一个对象，由key和json项组成
 * @return {promise}
 */
DBProvider.prototype.saveToBlockChain = function(array) {
    var promiseArray = [];
    var that = this;
    for (obj of array) {
        promiseArray.push(this.jsonPriver.saveJson(obj.key, obj.json));
    }
    return new Promise(function(resolve, reject) {
        // 成功，做清理工作，记录最后ID
        Promise.all(promiseArray).then(function(data) {
            that.clean();
            if (that.lastNoChange) {
                fs.writeFileSync(that.config.recordFile, JSON.stringify({
                    'lastNo': that.lastNo
                }), 'utf8');
            }
            resolve(data);
        }).catch(function(err) {
            that.clean();
            fs.writeFileSync(that.config.recordFile, JSON.stringify({
                'lastNo': that.lastNo
            }), 'utf8');
            reject(err);
        });
    })
};

/**
 * 从数据库查询数据，并将结果写入区块链中
 * @return {promise}
 */
DBProvider.prototype.queryAndSave = function() {
    var that = this;
    return that.getData().then(function(array) {
        return that.transformToJsons(array);
    }).then(function(array) {
        return that.saveToBlockChain(array);
    });
};
