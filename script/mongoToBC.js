const MongoProvider = require('./mongoProvider');
const dbconfig = require('./mongodb-config');

var dm = new MongoProvider(dbconfig);
dm.queryAndSave().then(function (array) {
  console.log("finished...");
}).catch(function (err) {
  console.log(err);
}).done(function () {
  // process.exit();
});
