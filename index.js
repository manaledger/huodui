var jsondata = require('./jsondata');
var Promise = require('bluebird');

var jd = new jsondata(false);

var obj = {
    hello: "hello",
    world: "world"
};

var json = JSON.stringify(obj);

var save = function(key, text) {
    jd.saveJson(key, text).catch(function(e) {
        console.log(e);
    });
};

save("t19", json);
