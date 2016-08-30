## 火堆

##### 项目描述
将数据存储在以太坊上并提供RestAPI访问接口

##### 技术栈
* [truffle](https://github.com/ConsenSys/truffle) 以太坊Dapp开发框架
* [testrpc](https://github.com/ethereumjs/testrpc#readme) 以太坊节点模拟器
* [express-generator](https://github.com/expressjs/generator) express应用骨架生成工具

##### 使用方法
1. 安装相关工具

```
npm install -g truffle ethereumjs-testrpc  
```

2. 启动testrpc

```
testrpc
```

3. 编译/部署合约

```
truffle migrate
```

4. 启动express

```
npm start
```

5. 访问[http://localhost:3000](http://localhost:3000)

##### RestAPI
1. 新增捐赠记录

```
路径：/donate/new
请求方式: POST
参数列表：{
    "pid": 1,
    "uid": 1,
    "ammount": 100,
    "paytype": 1
}
pid: 项目ID
uid: 用户ID
ammount: 捐赠金额
paytype: 1: 支付宝
         2: 微信
         3: 银联

返回成功: {
  "code": 0,
  "data": "0xc10755050a11c675007f6088e89de6bd8f44f60bdf27cd85493228f8b8ebeae7"
}

返回失败: {
  "code": -1,
  "error": "invalid address"
}    
```

2. 查询捐赠记录

```
路径: /donate/get
请求方式: GET
参数列表: ?id=xx
xx: 捐赠记录ID
返回成功：{
  "code": 0,
  "data": [
    "2",
    "3",
    "1472552181",
    "200",
    "1"
  ]
}
data中数据依序为: 项目ID，用户ID，捐赠时间，捐赠金额，捐赠方式

返回失败: {
  "code": -1,
  "error": "invalid address"
}
```
