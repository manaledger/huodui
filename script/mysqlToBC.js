const mysqlProvider = require('./mysqlProvider');
const dbconfig = require('./mysql-config');

var db = new mysqlProvider(dbconfig);

db.queryAndSave().then(function () {
  console.log('finished...');
}).catch(function (err) {
  console.log(err);
});
