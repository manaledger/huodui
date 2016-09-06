const mongoose = require('mongoose');
const util = require('util');
const DBProvider = require('./DBProvider');


module.exports = MongoProvider;
util.inherits(MongoProvider, DBProvider);

function MongoProvider(config) {
    if (!(this instanceof MongoProvider))
        return new MongoProvider(config);
    mongoose.Promise = Promise;
    this.db = mongoose.connect(config.url);

    DBProvider.call(this, config);
}

MongoProvider.prototype.getData = function() {
    var config = this.config;
    this.schema = new mongoose.Schema(config.schema, config.schemaOpt);
    var collection = this.db.model('xxx', this.schema);
    var sortOpt = {};
    sortOpt[config.sortKey] = config.sortOrder;

    return collection.find().sort(sortOpt).skip(this.lastNo).limit(config.limit).exec();
};

MongoProvider.prototype.clean = function() {
    mongoose.disconnect();
};
