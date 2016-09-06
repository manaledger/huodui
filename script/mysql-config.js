var mysqlConfig = {
   connection:{
     host: 'localhost',
     user: 'root',
     password: '123456',
     database: 'laravel5'
   },
   table: 'articles',
   splitCnt: 1,
   limit: 2,
   sortKey: 'id',
   sortOrder: 1,
   recordFile: __dirname + '/mysql-record.log'
};

module.exports = mysqlConfig;
