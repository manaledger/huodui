const Promise = require('bluebird');
const jsonProvider = require('./jsondata');
const fs = require('fs');

module.exports = DBProvider;

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

DBProvider.prototype.getData = function() {
    throw new Error('not implementing getData ...');
};

DBProvider.prototype.clean = function() {
    throw new Error('not implementing clean  ...');
};

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

DBProvider.prototype.saveToBlockChain = function(array) {
    var promiseArray = [];
    var that = this;
    for (obj of array) {
        promiseArray.push(this.jsonPriver.saveJson(obj.key, obj.json));
    }
    return new Promise(function(resolve, reject) {
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

DBProvider.prototype.queryAndSave = function() {
    var that = this;
    return that.getData().then(function(array) {
        return that.transformToJsons(array);
    }).then(function(array) {
        return that.saveToBlockChain(array);
    });
};
