##### RestAPI
1. 新增JSON记录

```
路径：/json/save
请求方式: POST
参数列表：{
  "key": "hello",
  "json": {
    "key": "hello",
    "json": "world"
  }
}
key: 键值，不超过32个字符
json: json对象

返回成功: {
  "code": 0,
  "data": "0x906321c1ca9501106ef8a5ff8ebb6e15f654b0e6e16774c0f78d591bb5198bc8"
}

返回失败: {
  "code": -1,
  "error": "xxx"
}    
```

2. 新增JSON记录(队列方式)

```
路径：/json/enqueue
请求方式: POST
参数列表：{
  "key": "hello",
  "json": {
    "key": "hello",
    "json": "world"
  }
}
key: 键值，不超过32个字符
json: json对象

返回成功: {
  "code": 0
}

返回失败: {
  "code": -1,
  "error": "xxx"
}    
```

3. 查询JSON记录

```
路径: /json/get
请求方式: GET
参数列表: ?key=xx
xx: 查询键值
返回成功：{
  "code": 0,
  "data": {
    "key": "hello",
    "json": "world"
  }
}

返回失败: {
  "code": -1,
  "error": "xxx"
}
```
