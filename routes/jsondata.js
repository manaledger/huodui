var express = require('express');
var WebJsondata  = require('../jsondata');
var router = express.Router();

var don = new WebJsondata();

/**
 * 获取key对应的JSON数据
 */
router.get('/get', function(req, res, next) {
  var key = req.query.key;
  if (key.length > 0) {
    don.setup(true).then(function () {
      return don.getJson(key);
    }).then(function (value) {
      var o = JSON.parse(value);
      res.json({code:0, data:o});
    }).catch(function (err) {
      res.json({code:-1, error:err.message});
    });
  }else{
    res.json({code:-1, error:"invalid parameter"});
  }
});

/*
 *  存储key和JSON数据
 */

router.post('/save', function(req, res, next) {
  var key = req.body.key;
  var json = req.body.json;
  try {
    if (json && typeof json === 'object') {
      var str = JSON.stringify(json);
      don.setup(true).then( function () {
        return don.saveJson(key, str);
      }).then(function (value) {
        res.json({code:0, data:value});
      }).catch(function (err) {
        res.json({code:-1, error:err.message});
      });
    }
  } catch (e) {
      res.json({code:-1, error:e.message});
  }
});


module.exports = router;
