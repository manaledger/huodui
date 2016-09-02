var mongoose = require('mongoose'),
    jsondata = require('./jsondata'),
    Promise = require('bluebird'),
    jd = new jsondata(),
    db = mongoose.connect('mongodb://localhost/test',function(err){
      if (err) throw err;
      Schema = new mongoose.Schema(
        {
          name:String,
          pass:String
        },{
          collections:'Person_Keven'
        });

        var personModle = db.model('Person_Keven',Schema);
        personModle.find(function(err,persondata){
          console.log(persondata);
            save("t18", JSON.stringify(persondata));
            mongoose.disconnect();
        });
    });

  var save = function(key, text){
      jd.setup(false).then(function () {
        return jd.saveJson(key, text);
      }).catch(function (err) {
        console.log(err);
      });
    };
