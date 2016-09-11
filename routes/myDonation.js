var express = require('express'),
    router = express.Router();
var mongoose = require('mongoose');
var db = require('../script/donationMongoGetData');

var promise = require('bluebird');
mongoose.Promise = promise;

var Memberschema = new  mongoose.Schema({
  _id:Number,
  project:{type:Number,ref:'projectdatabaseModel'}
},{
    collection:'donate'
  }),
  memberModel = db.model('memberdatabaseModel',Memberschema);

var projectschema = new mongoose.Schema({
  _id: Number,
},{
    collection:'project'
  }),
  projectModel = db.model('projectdatabaseModel',projectschema);

  var Paymentschema = new mongoose.Schema({},{
      collection:'payment'
    }),
    PaymentModel = db.model('PaymentdatabaseModel',Paymentschema);


router.get('/mydonation.html',function(req,res) {
  var path = require('path');
  var resolve =  path.resolve(__dirname, '..');
  res.sendFile(resolve + '/views/mydonation.html');
});

router.post('/mydonation_dataBranch',function(req,res){
  if (req.body.member === undefined || req.body.project === undefined) {
    res.send({code:0,message:'参数错误'});
  }else {
    memberModel.find(
      {member:parseInt(req.body.member),
        project:parseInt(req.body.project)
      },
      'date donate_fee member project',
      null,
      function(err,data){
      if (err) {
        res.send({code:0,message:'非常抱歉，服务器数据出错啦！'});
      }
      projectModel.findOne({_id:parseInt(req.body.project)},'_id verified realAmount',function(erro,prodata){
        if (erro) {
          console.log(erro);
          res.send({code:0,message:'非常抱歉，服务器数据出错啦！'});
        }
        PaymentModel.find({'project':parseInt(req.body.project)},function(err1,paydata){
          if (err1) {
            res.send({code:0,message:'非常抱歉，服务器数据出错啦！'});
          }
          // console.log(JSON.stringify(prodata));
          res.send({
            code:1,
            message:'成功',
            data:{
              personData:data,
              projectdata:prodata,
              paymentdata:paydata
            }
          });
        });

      });

    });
  }

});

router.get('/myDonateHistory.html',function(req,res){
  var path = require('path');
  var resolve =  path.resolve(__dirname, '..');
  res.sendFile(resolve + '/views/myDonateHistory.html');
});
router.post('/mydonation_history',function(req,res){
  if (req.body.member === undefined) {
    res.send({code:0,message:'参数错误'});
  }
  console.log(JSON.stringify(req.body));
  var gtTimeStr = req.body.totime < req.body.lasttime ? req.body.totime : req.body.lasttime;
  console.log(gtTimeStr);
    memberModel.find(
      {
        member:parseInt(req.body.member),
        // _id:{$gt:parseInt(req.body._id)},
        date:{"$gt": new Date(req.body.frometime),"$lt":new Date(gtTimeStr)}
      },
      '_id date donate_fee member project').sort({'date':-1}).populate('project','_id name').limit(10).then(function(data){
        res.send(
          {code:1,
          message:'成功',
          data:data
        }
        );
      }).catch(function(err){
        console.log(err);
        res.send({code:0,message:err.message});
      });

});
module.exports=router;
