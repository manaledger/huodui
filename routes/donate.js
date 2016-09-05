var express = require('express');
var Donate  = require('../script/donate');
var router = express.Router();

var don = new Donate();
/**
 * 捐赠函数，将捐赠信息写入数据库和区块链中
 * @param  {number} projectID 项目ID
 * @param  {number} userID    用户ID
 * @param  {number} ammount   捐赠金额
 * @param  {number} payType   捐赠方式
 * @return {}
 */
// function donate(projectID, userID, ammount, payType) {
//   // 写入区块链
//   // don.donate(projectID, userID, ammount, payType);
//   // 写入数据库
// }

/**
 * 获取一段时间内某项目的捐献情况
 * @param  {string}   projectID 项目ID
 * @param  {datetime} startTime 开始时间
 * @param  {datetime} endTime   结束时间
 * @return {array}              捐赠信息数组
 */
function getDonateByProject(projectID, startTime, endTime) {

}

/**
 * 获取一段时间内某用户的捐献情况
 * @param  {string}   userID    用户ID
 * @param  {datetime} startTime 开始时间
 * @param  {datetime} endTime   结束时间
 * @return {array}              捐赠信息
 */
function getMyDonate(userID, startTime, endTime) {

}



/* GET users listing. */
router.get('/get', function(req, res, next) {
  var id = parseInt(req.query.id);

  don.donateById(id).then(function (value) {
    res.json({code:0, data:value})
  }).catch(function (err) {
    res.json({code:-1, error:err});
  });
});

router.post('/new', function(req, res, next) {
  var projectID = parseInt(req.body.pid);
  var userID = parseInt(req.body.uid);
  var ammount = parseInt(req.body.ammount);
  var payType = parseInt(req.body.paytype);

  don.donate(projectID, userID, ammount, payType).then(function (value) {
    res.json({code:0, data:value});
  }).catch(function (err) {
    res.json({code:-1, error:err.message});
  });
})



module.exports = router;
