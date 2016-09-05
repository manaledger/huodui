const mongodata = require('./mongo-multi');
const dbconfig = require('./db-config');

var dm = new mongodata(dbconfig);
dm.queryAndSave().then(function (array) {
  console.log("finished...");
}).catch(function (err) {
  console.log(err);
}).done(function () {
  // process.exit();
});
