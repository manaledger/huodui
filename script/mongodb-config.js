var mongoConfig = {
   // mongo数据库Url
   url: 'mongodb://localhost/SCFIREDevDB',
   // 定义集合数据导出格式
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
   // 指定集合名称
   schemaOpt:{
     collection: 'FDonate',
   },
   // 每1条区块链记录对应数据库多少条记录
   splitCnt: 2,
   // 每次查询数据条数限制
   limit: 4,
   // 排序列名
   sortKey: '_id',
   // 排序方式, 1: 升序，-1: 降序
   sortOrder: 1,
   // 记录文件
   recordFile: __dirname + '/record.log'
};

module.exports = mongoConfig;
