# ai-tools-ui

## Data
* 主机列表 /api/kv/chaos/node
``` 
[
  {
    "id": "node:1",
    "ip": "ip1",
    "name": "主中心-redis-node1"
  },
  {
    "ip": "ip1",
    "name": "主中心-redis-node1"
  }
]

POST 
{"data":{
    "ip": "ip5",
    "name": "主-redis-5"
}}
```
* 混沌实验列表 /api/kv/chaos/blade
``` 
[
  {
    "id": "blade:1",
    "name": "网络丢包",
    "cmd": "blade create network loss",
    "params": [
      {
        "id": "--percent",
        "name": "百分比",
        "lable": "0-100"
      },
      {
        "id": "--interface",
        "name": "网卡",
        "lable": "默认eth0"
      }
    ]
  }
]
```
* 混沌实验场景编排 /api/kv/chaos/designer
```
[
  {
    "node": {
      "ip": "ip1",
      "name": "主中心-redis-node1"
    },
    "blades": [
      {
        "id": "network-loss",
        "name": "网络丢包",
        "cmd": "blade create network loss",
        "params": [
          {
            "id": "--percent",
            "name": "百分比",
            "lable": "0-100",
            "value": "60"
          },
          {
            "id": "--interface",
            "name": "网卡",
            "lable": "默认eth0",
            "value": "eth0"
          }
        ]
      }
    ]
  }
]

```

* CRUD
``` 
[GIN-debug] POST   /api/kv/:b/:k             --> github.com/yusys-cloud/ai-tools/server.(*Server).create-fm (3 handlers)
[GIN-debug] GET    /api/kv/:b/:k             --> github.com/yusys-cloud/ai-tools/server.(*Server).readAll-fm (3 handlers)
[GIN-debug] GET    /api/kv/:b/:k/:kid        --> github.com/yusys-cloud/ai-tools/server.(*Server).readOne-fm (3 handlers)
[GIN-debug] PUT    /api/kv/:b/:k/:kid        --> github.com/yusys-cloud/ai-tools/server.(*Server).update-fm (3 handlers)
[GIN-debug] DELETE /api/kv/:b/:k/:kid        --> github.com/yusys-cloud/ai-tools/server.(*Server).delete-fm (3 handlers)    

```

## Build Setup

``` bash
# install dependencies
npm install
yarn install

# serve with hot reload at localhost:8080
npm run serve
yarn serve

# build for production with minification
npm run build
yarn build
```

