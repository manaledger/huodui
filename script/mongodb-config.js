var mongoConfig = {
   url: 'mongodb://localhost/SCFIREDevDB',
   schema: {
     _id: Number,
     date: Date,
     donate: Number,
     donate_fee: Number,
     fundPool: Number,
     member: Number,
     project: Number,
     status: Boolean,
     version: Number
   },
   schemaOpt:{
     collection: 'FDonate',
   },
   splitCnt: 2,
   limit: 4,
   sortKey: '_id',
   sortOrder: 1,
   recordFile: __dirname + '/record.log'
};

module.exports = mongoConfig;
