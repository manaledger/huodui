var express = require('express');
const mqconfig = require('../script/mqconfig');
const open = require('amqplib').connect(mqconfig.url);
var WebJsondata  = require('../script/jsondata');
var router = express.Router();

var don = new WebJsondata();
var channel;

open.then(function (conn) {
  return conn.createChannel();
}).then(function (ch) {
  channel = ch;
  return ch.assertExchange(mqconfig.exchange, 'topic', {durable:true});
}).catch(console.warn);

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

router.post('/enqueue', function (req, res, next) {
  if (channel){
    channel.publish(mqconfig.exchange, mqconfig.defaultKey, new Buffer(JSON.stringify(req.body)), {persistent:true});
    res.json({code:0});
  }else{
    res.json({code:-1, error:'system not reday!'});
  }
});


module.exports = router;
