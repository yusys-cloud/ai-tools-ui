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
  },
  {
    "name": "线程等待",
    "cmd": "thread-wait",
    "params": [
      {
        "name": "等待时间(秒)",
        "lable": "60",
        "value": "120"
      }
    ]
  }
]
```
* 混沌实验场景编排 /api/kv/chaos/designer
```
{
	"chaos": [{
		"node": {
			"ip": "172.18.87.69",
			"name": "本地测试"
		},
		"blades": [{
			"cmd": "blade create cpu load",
			"desc": "CPU 相关的混沌实验包含 CPU 满载，可以指定核数、具体核满载或者总 CPU 负载百分比",
			"id": "blade:1377544835698790400",
			"name": "主机-CPU-负载",
			"params": [{
				"desc": "设定运行时长，单位是秒，通用参数",
				"id": " --timeout",
				"label": "3000",
				"name": "运行时长",
				"value": "3000"
			}],
	"name": "实验名称",
	"desc": "实验描述",
	"status": 0
}

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

