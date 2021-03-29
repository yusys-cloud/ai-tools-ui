# ai-tools-ui

## Data
* 主机列表 /api/kv/chaos/node
``` 
[
  {
    "ip": "ip1",
    "name": "主中心-redis-node1"
  },
  {
    "ip": "ip1",
    "name": "主中心-redis-node1"
  }
]
```
* 混沌实验列表 /api/kv/chaos/blade
``` 
[
  {
    "id": "network-loss",
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

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build
```

