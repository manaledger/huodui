var jsondata = require('./jsondata');
var Promise = require('bluebird');

var jd = new jsondata();

var obj = {
  hello:"hello",
  world:"world"
};

var json = JSON.stringify(obj);

var save = function(key, text){
  jd.setup(false).then(function () {
    return jd.saveJson(key, text);
  }).catch(function (err) {
    console.log(err);
  });
}

save("t14", json);
