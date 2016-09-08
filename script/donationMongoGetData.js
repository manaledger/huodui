var mongoose = require('mongoose');
var donationDB = mongoose.connect('mongodb://localhost/SCFIREDevDB',function(err){
  if (err) throw err;
});
// donationDB.prototype.mongoose = mongoose;
module.exports=donationDB;
