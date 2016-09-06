var mysqlConfig = {
   // mysql 连接信息
   connection:{
     host: 'localhost',
     user: 'root',
     password: '123456',
     database: 'laravel5'
   },
   // 查询的表名
   table: 'articles',
   // 每1条区块链记录对应数据库多少条记录
   splitCnt: 1,
   // 每次查询返回的记录数量限制
   limit: 2,
   // 排序列名
   sortKey: 'id',
   // 排序方法，1：升序，其他降序
   sortOrder: 1,
   // 记录文件
   recordFile: __dirname + '/mysql-record.log'
};

module.exports = mysqlConfig;
