<template>
  <el-row>
    <el-col :span="4">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>主机资源</span>
          <el-button size="mini" @click="addHost" style="float: right">添加</el-button>
        </div>
        <el-row style="margin-top: 5px">
          <draggable class="dragArea list-group" v-model="hostList" v-bind="dragOptions" :sort="false" :group="{ name: 'chaos', pull: 'clone', put: false }" :clone="cloneHost">
            <transition-group>
              <div class="list-group-item host-item" v-for="element in hostList" :key="element.ip" :title="element.ip">
                {{ element.name }}
                <i class="el-icon-edit" @click="editHost(element)"></i>
                <i class="el-icon-delete" @click="deleteHost(element)"></i>
              </div>
            </transition-group>
          </draggable>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>演练场景</span>
          <el-button size="small" @click="showChaosForm" style="float: right">保存实验</el-button>
        </div>
        <el-col :span="10">
          <draggable class="list-group dragArea" v-model="chaosList" v-bind="dragOptions" @add="chaosAdded" :move="checkBladeMove">
            <transition-group>
              <div v-for="(item, index) in chaosList" :key="item.name + index">
                <div class="host-item list-group-item" style="margin-top: 12px" v-if="item.type == 'host'">
                  <span>{{ item.name }} {{ item.ip }}</span>
                  <i class="el-icon-close" v-if="!item.virtual" @click="deleteChaos(item)"></i>
                </div>
                <div class="blade-item list-group-item" v-else @click="showParam(item)">
                  <el-tooltip content="单击配置实验参数" placement="left" effect="light">
                    <span>{{ item.name }} {{ item.cmd }}</span>
                  </el-tooltip>
                  <i class="el-icon-close" v-if="!item.virtual" @click="deleteChaos(item)"></i>
                </div>
              </div>
            </transition-group>
          </draggable>
        </el-col>
        <!-- 某个场景的配置参数 -->
        <el-col :span="14">
          <el-form :model="chaosParam" class="param-panel" size="small">
            <el-form-item v-for="(item, index) in chaosParamsConfig" :key="index" :label="item.name">
              <span slot="label">
                <div class="param-label">{{ item.name }}</div>
                <p class="param-desc">{{ item.desc }}</p>
              </span>
              <el-input v-model="chaosParam[item.id]" :placeholder="item.label" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-card>
    </el-col>
    <el-col :span="4">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基础演练场景</span>
          <el-button size="mini" @click="addBlade" style="float: right">添加</el-button>
        </div>
        <draggable class="list-group dragArea" v-model="bladeList" v-bind="dragOptions" :sort="false" :group="{ name: 'chaos', pull: 'clone', put: false }" :clone="cloneBlade" :move="checkBladeMove">
          <transition-group type="transition" name="flip-list">
            <div class="list-group-item  blade-item" v-for="element in bladeList" :key="element.id">
              {{ element.name }}<i class="el-icon-edit" @click="editBlade(element)"></i>
              <i class="el-icon-delete" @click="deleteBlade(element)"></i>
            </div>
          </transition-group>
        </draggable>
      </el-card>
    </el-col>
    <el-drawer :withHeader="false" :visible.sync="bladeForm.visible" direction="rtl" size="45%" :modal-append-to-body="false">
      <el-form :model="bladeForm.data" :rules="bladeForm.rules" label-width="120px" size="small" width="90%" style="margin-top:30px">
        <el-form-item label="混沌测试名称" prop="name">
          <el-input v-model="bladeForm.data.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="混沌测试命令" prop="cmd">
          <el-input v-model="bladeForm.data.cmd" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item class="param-config" label-width="0" v-for="(item, index) in bladeForm.data.params" :key="index">
          <el-input class="param-item" style="width: 27%;" v-model="item.name" placeholder="参数中文名" autocomplete="off" clearable></el-input>
          <el-input class="param-item" style="width: 27%;" v-model="item.id" placeholder="参数英文" clearable></el-input>
          <el-input class="param-item" style="width: 27%;" v-model="item.label" placeholder="参数推荐值"></el-input>
          <el-button class="param-item" style="width: 12%;" size="small" icon="el-icon-delete" @click.prevent="removeParam(index,item)">删除</el-button>
          <el-input type="textarea" class="param-item" style="width: 95%;" :rows="1" v-model="item.desc" placeholder="参数描述" clearable></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="addParam" size="small" icon="el-icon-plus">添加配置参数</el-button>
        <el-button @click="bladeForm.visible=false" size="small">取消</el-button>
        <el-button type="primary" @click="saveBlade" size="small">保存</el-button>
      </div>
    </el-drawer>
    <el-drawer title="添加主机" :visible.sync="hostForm.visible" direction="ltr" size="20%" :modal-append-to-body="false">
      <el-form class="chaosForm" ref="hostForm" :model="hostForm.data" :rules="hostForm.rules" label-width="80px" size="small" width="100px">
        <el-form-item label="主机名称" prop="name">
          <el-input v-model="hostForm.data.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="ip">
          <el-input v-model="hostForm.data.ip" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="small" @click="hostForm.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveHost">保存</el-button>
      </div>
    </el-drawer>
    <el-dialog title="保存实验" :visible.sync="basicChaosForm.visible" :modal-append-to-body="false">
      <el-form ref="basicChaosForm" :model="basicChaosForm.data" :rules="basicChaosForm.rules" label-width="80px" size="small" width="100px">
        <el-form-item label="实验名称" prop="name">
          <el-input v-model="basicChaosForm.data.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="实验描述" prop="desc">
          <el-input v-model="basicChaosForm.data.desc" type="textarea" autocomplete="off" placeholder="请输入内容" :rows="2" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="basicChaosForm.visible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveChaos">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import draggable from "vuedraggable";
var chaosIndex = 0;
export default {
  name: "chaosEditor",
  components: {
    draggable,
  },
  data: function () {
    return {
      dragOptions: {
        animation: 0,
        group: "chaos",
        disabled: false,
        ghostClass: "ghost",
        scroll: true,
      },
      // 显示的主机列表.
      hostList: [],
      hostForm: {
        visible: false,
        type: "add",
        data: {},
        rules: {
          name: [{ required: true, message: "请输入主机名称" }],
          ip: [{ required: true, message: "请输入主机IP" }],
        },
      },
      // 混沌实验基础场景.
      bladeList: [],
      bladeForm: {
        visible: false,
        type: "add",
        data: { params: [] },
        rules: {
          name: [{ required: true, message: "请输入主机名称" }],
          cmd: [{ required: true, message: "请输入命令" }],
        },
      },
      // 是否显示主机没有添加的提示消息.
      bladeDragNotiMessage: true,
      notiMessage: "",
      // 编排的实验场景.
      chaosList: [
        { id: "0", type: "host", name: "拖拽主机到这里", virtual: true },
      ],
      // 放置当前场景的配置值.
      chaosParam: {},
      // 放置不同场景的配置值.
      chaosParams: {},
      // 用于动态渲染面板.
      chaosParamsConfig: [],
      basicChaosForm: {
        visible: false,
        data: {},
        rules: {
          name: [
            { required: true, message: "请输入实验名称", trigger: "blur" },
          ],
          desc: [
            { required: true, message: "请输入实验描述", trigger: "blur" },
          ],
        },
      },
      // 编排的实验数据.
      chaosRecord: {},
    };
  },
  created: function () {
    this.queryHostList();
    this.queryBlades();
  },
  methods: {
    openFullScreenLoading() {
      this.$loading.service({
        fullscreen: true,
        spinner: "el-icon-loading",
        text: "拼命加载中",
        background: "rgba(0, 0, 0, 0.8)",
      });
    },
    closeFullScreenLoading() {
      let loadingInstance = this.$loading.service({ fullscreen: true });
      this.$nextTick(() => {
        // 以服务的方式调用的 Loading 需要异步关闭
        loadingInstance.close();
      });
    },
    /**
     * 查询主机列表.
     */
    queryHostList: function () {
      var _this = this;
      _this.$axios.get("/api/kv/chaos/node").then((res) => {
        // 由于现在查询出来是map结构,所以进行转换.把key转换为ID属性.
        _this.hostList = _this.$util.arrayKv(res, "id");
      });
    },
    addHost: function () {
      this.hostForm.type = "add";
      this.hostForm.visible = true;
    },
    editHost: function (item) {
      var _this = this;
      _this.hostForm.data = _this.$util.deepClone(item);
      this.hostForm.type = "edit";
      this.hostForm.visible = true;
    },
    saveHost: function () {
      // 校验
      var _this = this;
      this.$refs["hostForm"].validate((valid) => {
        if (valid) {
          // 添加遮罩
          _this.sendSaveRequest();
        } else {
          return false;
        }
      });
    },
    sendSaveRequest: function () {
      var _this = this;
      var data = _this.hostForm.data;
      _this.saveFn(
        "/api/kv/chaos/node",
        data.id,
        _this.hostForm.type,
        data,
        "保存主机成功!",
        () => {
          _this.hostForm.visible = false;
          _this.queryHostList();
        }
      );
    },
    deleteHost: function (item) {
      var _this = this;
      _this.deleteFn(
        "此操作将删除该主机,是否继续?",
        "/api/kv/chaos/node/" + item.id,
        _this.queryHostList
      );
    },
    /**
     * 复制主机到演练场景.
     */
    cloneHost: function (item) {
      return {
        index: chaosIndex++,
        name: item.name,
        ip: item.ip,
        type: "host",
      };
    },
    /**
     * 查询混沌实验.
     */
    queryBlades: function () {
      var _this = this;
      _this.$axios.get("/api/kv/chaos/blade").then((data) => {
        if (data) {
          _this.bladeList = _this.$util.arrayKv(data, "id");
        }
      });
    },
    /**
     * 添加基础混沌实验参数.
     */
    addParam: function () {
      var _this = this;
      _this.bladeForm.data.params.push({});
    },
    /**
     * 移除配置参数.
     */
    removeParam: function (index) {
      this.bladeForm.data.params.splice(index, 1);
    },
    saveBlade: function () {
      var _this = this;
      var data = _this.bladeForm.data;
      _this.saveFn(
        "/api/kv/chaos/blade",
        data.id,
        _this.bladeForm.type,
        data,
        "保存基础实验成功!",
        () => {
          _this.bladeForm.visible = false;
          _this.queryBlades();
        }
      );
    },
    addBlade: function () {
      var _this = this;
      _this.bladeForm.type = "add";
      _this.bladeForm.visible = true;
    },
    /**
     * 展示基础场景的变更页面.
     */
    editBlade: function (item) {
      var _this = this;
      _this.bladeForm.data = _this.$util.deepClone(item);
      _this.bladeForm.type = '"edit';
      _this.bladeForm.visible = true;
    },
    deleteBlade: function (item) {
      var _this = this;
      _this.deleteFn(
        "此操作将永久删除该基础场景, 是否继续?",
        "/api/kv/chaos/blade/" + item.id,
        _this.queryBlades
      );
    },
    saveFn: function (postUrl, id, type, data, msg, successFunction) {
      var _this = this;
      _this.openFullScreenLoading();
      var method = "post";
      var url = postUrl;
      if (type != "add") {
        method = "put";
        url = postUrl + "/" + id;
      }
      _this
        .$axios({
          method: method,
          url: url,
          data: data,
        })
        .then(() => {
          _this.$message(msg);
          successFunction();
        })
        .finally(() => {
          _this.closeFullScreenLoading();
        });
    },
    deleteFn: function (msg, url, queryFunction) {
      var _this = this;
      _this
        .$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          _this.$axios.delete(url).then(() => {
            _this.$message({
              type: "success",
              message: "删除成功!",
            });
            queryFunction();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 克隆选择的实验场景.
     */
    cloneBlade: function (item) {
      var newItem = this.$util.deepClone(item);
      newItem.type = "blade";
      // 实验场景的唯一标识.
      newItem.index = chaosIndex++;
      return newItem;
    },
    /**
     * 校验blade的复制.
     * 必须演练的地方存在一个主机,否则返回false.
     */
    checkBladeMove: function (evt) {
      var _this = this;
      var relatedContext = evt.relatedContext;
      var contextList = relatedContext.list;
      if (!contextList || contextList.length == 0) {
        _this.showMessage("请先添加主机节点");
        return false;
      } else if (contextList.length == 1 && contextList[0].virtual) {
        // 如果存在一个节点,但是为虚拟主机节点.
        _this.showMessage("请先添加主机节点");
        return false;
      }
      if (evt.draggedContext.futureIndex == 0) {
        this.showMessage("实验必须放置在主机下");
        return false;
      }
    },
    showMessage: function (msg) {
      var _this = this;
      if (_this.notiMessage != msg || _this.bladeDragNotiMessage) {
        // 提示不重复的消息或者提示的消息已经消失.
        _this.bladeDragNotiMessage = false;
        this.notiMessage = msg;
        _this.$message({
          type: "warnning",
          message: msg,
          onClose: _this.resetMessage,
        });
      }
    },
    /**
     * 重置提示消息面板.
     */
    resetMessage: function () {
      this.bladeDragNotiMessage = true;
    },
    /**
     * 当添加一个节点的回调方法.
     */
    chaosAdded: function () {
      var _this = this;
      var chaos = _this.chaosList;
      if (chaos.length == 2) {
        var virutalNode;
        for (var i = 0; i < chaos.length; i++) {
          var item = chaos[i];
          if (item && item.type == "host" && item.virtual) {
            virutalNode = item;
            break;
          }
        }
        if (virutalNode) {
          // 存在虚拟主机，移除并且添加虚拟实验.
          chaos.splice(i, 1);
        }
      }
    },
    /**
     * 根据当前选中的实验进行参数的配置.
     */
    showParam: function (item) {
      var _this = this;
      _this.chaosParamsConfig = item.params;
      if (!_this.chaosParams[item.index]) {
        _this.chaosParams[item.index] = {};
      }
      _this.chaosParam = _this.chaosParams[item.index];
    },
    /**
     * 显示保存实验页面.
     */
    showChaosForm: function () {
      var _this = this;
      var chaos = _this.chaosList;
      // 某些主机节点不存在实验.
      var chaosRecord = { chaos: [] };
      var list = chaosRecord.chaos;
      var lastNode = {};
      //  记录不存在实验的主机.
      var notExistExpHost = [];
      for (let i = 0; i < chaos.length; i++) {
        let element = chaos[i];
        if (element.virtual) {
          this.$message({
            message: "还未开始编排实验，请编排之后再保存!",
            type: "warning",
          });
          return;
        }

        if (_this.isHostNode(element.type)) {
          if (lastNode.type == element.type) {
            //上一台主机过了就是主机.
            notExistExpHost.push(lastNode.name);
            // 移除上一个节点.
            list.pop();
          }
          // 添加新的节点.
          list.push({
            node: { ip: element.ip, name: element.name },
            blades: [],
          });
        } else {
          // 实验节点.
          let hostNode = list[list.length - 1];
          // 需要读取配置.
          let config = _this.$util.deepClone(element);
          let params = _this.chaosParams[config.index];
          delete config.index;
          config.params.forEach((p) => {
            p.value = params[p.id];
          });
          hostNode.blades.push(config);
        }

        // 记录上一个节点.
        lastNode = element;
      }
      if (notExistExpHost.length > 0) {
        this.$message({
          message:
            "存在未配置实验的主机:" +
            Array.toString(notExistExpHost) +
            ",这些主机不会保存",
          type: "warning",
        });
      }
      _this.chaosRecord = chaosRecord;
      _this.basicChaosForm.visible = true;
    },
    /**
     * 保存所有编排的实验.
     */
    saveChaos: function () {
      var _this = this;
      _this.$refs["basicChaosForm"].validate((valid) => {
        if (valid) {
          var data = _this.chaosRecord;
          data.name = _this.basicChaosForm.data.name;
          data.desc = _this.basicChaosForm.data.desc;
          data.status = 0;
          _this.openFullScreenLoading();
          _this.$axios
            .post("/api/kv/chaos/designer", data)
            .then(() => {
              _this.$message({
                message: "保存成功",
                type: "success",
              });
              _this.basicChaosForm.visible = false;
            })
            .finally(() => {
              _this.closeFullScreenLoading();
            });
        } else {
          return false;
        }
      });
    },
    /**
     * 删除节点.
     */
    deleteChaos: function (item) {
      var _this = this;
      var index = item.index;
      var isHostNode = _this.isHostNode(item.type);
      var type = isHostNode ? "主机" : "实验配置";
      // 删除之前的校验.
      var chaos = _this.chaosList;
      var message = "此操作将删除" + type + ", 是否继续?";
      var deleteAll = false;
      if (isHostNode) {
        if (chaos.length > 1) {
          // 最后一个主机节点.不允许删除.
          var count = 0;
          for (let index = 0; index < chaos.length; index++) {
            const element = chaos[index];
            if (_this.isHostNode(element.type)) {
              count++;
            }
            if (count == 2) {
              break;
            }
          }
          if (count == 1) {
            message = "最后一个主机,删除主机将会删除所有配置,是否继续?";
            deleteAll = true;
          }
        } else {
          deleteAll = true;
        }
      }

      _this
        .$confirm(message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          if (deleteAll) {
            _this.chaosList.splice(0);
            _this.chaosList.push({
              id: "0",
              type: "host",
              name: "拖拽主机到这里",
              virtual: true,
            });
            _this.chaosParams = {};
            chaosIndex = 0;
          } else {
            for (let i = 0; i < _this.chaosList.length; i++) {
              if (index == _this.chaosList[i].index) {
                // 删除节点.
                _this.chaosList.splice(i, 1);
                if (_this.chaosParams[index]) {
                  delete _this.chaosParams[index];
                }
                break;
              }
            }
          }

          _this.$message({
            type: "success",
            message: "删除" + type + "成功!",
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    isHostNode: function (type) {
      return type == "host";
    },
  },
};
</script>

<style>
/* 通用配置项 */
.text {
  font-size: 14px;
}
.chaosForm {
  max-width: 90%;
}

.box-card {
  width: 98%;
  height: 628px;
}

.list-group {
  /* overflow: scroll;
  overflow-x: hidden; */
  min-height: 20px;
}

.dragArea {
  height: 500px;
  background-color: #f5f5f5;
}
.list-group-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}

.list-group-item i {
  float: right;
  margin-right: 5px;
  line-height: unset;
}
/* 右侧基本实验的样式 */
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.host-item {
  background-color: #a5c9ff;
}
.blade-item {
  background-color: #a5ffc9;
}
.param-label {
  line-height: 25px;
  cursor: pointer;
  text-align: left;
  width: 100%;
}
.param-desc {
  cursor: pointer;
  float: left;
  color: #888;
  font-size: 12px;
  line-height: 14px;
}
.param-panel {
  float: right;
  margin-left: 5%;
  max-height: 500px;
  overflow: scroll;
  overflow-x: hidden;
}
.param-config {
  float: left;
}
.param-item {
  margin: 3px 0.2%;
}
.el-drawer.rtl {
  overflow: scroll;
}
</style>
