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

6. RestAPI (http须设置请求头Content-type为application/json)
* [donate](doc/donateApi.md)  捐赠接口
* [jsondata](doc/jsondataApi.md) 通用Json接口
