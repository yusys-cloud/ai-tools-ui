<template>
  <div>
    <el-row>
      <el-card>
        <div slot="header" class="card-header">
          <span>演练实验</span>
          <el-button size="small" style="float: right" icon="el-icon-refresh" @click="queryChaos">刷新</el-button>
        </div>
        <div class="tool-bar">
          <el-button size="small" @click="chaosDialog.visible = true">添加</el-button>
          <el-button size="small" @click="batchExecChaosTask">执行</el-button>
        </div>
        <el-input v-model="chaosCondition" style="{float: right;width: 200px;}" placeholder="输入名称过滤实验" size="small" @input="chaosFilter" />
        <el-table ref="chaosTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="chaosList" max-height="500px" :default-sort="{ prop: 'name', order: 'ascending' }" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="实验名称" prop="name" width="200" sortable />
          <el-table-column label="实验描述" prop="desc" width="300" />
          <el-table-column label="执行状态" sortable width="200">
            <template #default="scope">
              <el-progress :percentage="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="主机列表">
            <template #default="scope">
              <el-tag v-for="(item, index) in scope.row.chaos" :key="item.node.name + index" size="medium" style="margin-left: 8px">{{ item.node.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200px">
            <template #default="scope">
              <el-button type="text" size="small" @click="execChaos(scope.row)">执行</el-button>
              <el-button type="text" size="small" @click="editChaos(scope.row)">编辑</el-button>
              <!-- TODO 添加清理已有的任务 -->
              <el-button type="text" size="small" @click="copyChaos(scope.row)">复制</el-button>
              <el-button type="text" size="small" @click="deleteChaos(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-dialog class="chaosEditor" :visible.sync="chaosDialog.visible" title="演练场景编排" fullscreen>
      <chaosEditor :chaos-data="selectChaosData" :type="chaosDialog.type" @after-save-chaos="afterSaveChaos" />
    </el-dialog>
  </div>
</template>

<script>
import ChaosEditor from './ChaosEditor.vue';
const designApi = '/api/kv/chaos/designer/';
export default {
  name: 'ChaosMgnt',
  components: {
    ChaosEditor
  },
  data: function () {
    return {
      chaosList: [],
      allChaosList: [],
      loading: true,
      total: 0,
      chaosCondition: '',
      selectedChaos: [],
      chaosDialog: {
        visible: false,
        type: 'add'
      },
      selectChaosData: {}
    };
  },
  created: function () {
    var _this = this;
    _this.queryChaos();
  },
  methods: {
    handleSelectionChange: function (val) {
      this.selectedChaos = val;
    },
    /**
     * 查询混乱测试.
     */
    queryChaos: function () {
      var _this = this;
      _this.loading = true;
      _this.$axios
        .get(designApi)
        .then((data) => {
          if (data) {
            var array = _this.$util.arrayKv(data, 'id');
            _this.chaosList = array;
            // 不能使用赋值，使用clone.
            _this.allChaosList = array.slice();
          } else {
            _this.chaosList = [];
            // 不能使用赋值，使用clone.
            _this.allChaosList = array.slice();
          }
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    chaosFilter: function (value) {
      var _this = this;
      if (!value) {
        _this.chaosList = _this.allChaosList.slice();
      } else {
        _this.chaosList = _this.allChaosList.filter(
          (chaos) => chaos.name.indexOf(value) > -1
        );
      }
    },
    /**
     * 执行任务.
     */
    execChaos: function (item) {
      // 执行案例.
      var _this = this;
      _this
        .$confirm(
          '此操作将开始执行混沌测试:[' + item.name + '], 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          console.log('执行实验:[' + item.name + ']');
          var execTaskCount = 0;
          var execResult = [];
          item.status = 0;
          item.chaos.forEach((element) => {
            console.log('执行主机:[' + element.node.name + '] 实验');
            _this.execTask(item, 0, 0, execTaskCount, execResult);
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    /**
     * 执行某主机的某个实验.
     */
    execTask: function (item, nodeIndex, expIndex, execTaskCount, execResult) {
      var _this = this;
      const node = item.chaos[nodeIndex];
      const total = item.total;
      const exp = node.blades[expIndex];
      var cmd = exp.cmd;
      cmd = cmd.startsWith('blade ') ? cmd.substring(6) : cmd;
      // 不同类型命令不一致.
      var taskType = exp.type;
      // 容错处理一下.
      if (!taskType) {
        taskType = cmd == 'destroy' ? 'D' : cmd == 'thread-wait' ? 'W' : 'C';
      }
      if (taskType == 'D') {
        //  销毁实验.
        const taskId = execResult.pop();
        cmd += ' ' + taskId;
      } else {
        // 创建实验或者prepare.
        var params = '';
        exp.params.forEach((p) => {
          if (p && p.value) {
            params += ' ' + p.id + ' ' + p.value;
          }
        });
        cmd = cmd + params;
      }

      console.log(
        _this.$util.stringFormat(
          '执行主机:[{0}],实验:{1},CMD:[{2}]',
          node.node.ip,
          exp.name,
          exp.cmd
        )
      );

      // 不同类型执行方式不一致.
      if (taskType == 'W') {
        // 执行等待.
        var waitTime = node.blades[0].value;
        if (waitTime) {
          waitTime = 5;
        }
        setTimeout(
          () =>
            _this.execTaskSuccessCallback(
              { code: 200, success: true, result: '' },
              item,
              nodeIndex,
              expIndex,
              taskType,
              execTaskCount,
              total,
              execResult
            ),
          5 * 1000
        );
      } else {
        cmd = cmd.replaceAll(' ', '%20');
        // TODO 实现根据节点名称获取最新的主机IP.
        cmd = 'http://' + node.node.ip + ':6666/chaosblade?cmd=' + cmd;
        _this
          .$axios({
            url: '/api/http/do',
            data: { url: cmd },
            timeout: -1,
            method: 'post'
          })
          .then((res) => {
            _this.execTaskSuccessCallback(
              res,
              item,
              nodeIndex,
              expIndex,
              taskType,
              execTaskCount,
              total,
              execResult
            );
          })
          .catch((error) => {
            _this.$message({
              message: _this.$util.stringFormat(
                '实验[{0}]执行主机:{1}的 实验:{2},cmd:{3}异常:{4}',
                item.name,
                node.node.name,
                exp.name,
                exp.cmd,
                error
              ),
              type: 'error'
            });
          });
      }
    },
    execTaskSuccessCallback: function (
      res,
      item,
      nodeIndex,
      expIndex,
      taskType,
      execTaskCount,
      total,
      execResult
    ) {
      var _this = this;
      const node = item.chaos[nodeIndex];
      console.log(
        _this.$util.stringFormat(
          '执行状态:[{0}],是否成功:[{1}],实验编号:[{2}]',
          res.code,
          res.success,
          JSON.stringify(res.result)
        )
      );
      // 需要根据不同类型进行处理.
      if (taskType != 'D' && taskType != 'W') {
        execResult.push(res.result);
      }

      // 执行成功之后,更新状态.
      // 根据总实验数进行添加100%比.
      execTaskCount++;
      if (execTaskCount == total) {
        item.status = 100;
      } else {
        item.status += Math.round(100 / total);
      }
      _this.updateTaskStatus(item);
      // 执行下一个节点.
      // 如果是最后一个实验,叠加主机.
      if (expIndex < node.blades.length - 1) {
        expIndex++;
      } else if (nodeIndex < item.chaos.length - 1) {
        nodeIndex++;
        expIndex = 0;
      } else {
        return;
      }
      _this.execTask(item, nodeIndex, expIndex, execTaskCount, execResult);
    },
    /**
     * 更新任务的状态.
     */
    updateTaskStatus: function (item) {
      var _this = this;
      _this.$axios.put(designApi + item.id, item).finally(() => {
        console.log('更新任务进度:' + item.status);
      });
    },
    batchExecChaosTask: function () {
      // 批量执行.
      // 执行案例.
      var _this = this;
      // TODO 执行批量混乱测试.
      _this.$message('暂时未实现批量执行!');
    },
    editChaos: function (item) {
      var _this = this;
      _this.selectChaosData = _this.$util.deepClone(item);
      _this.chaosDialog.type = 'edit';
      _this.chaosDialog.visible = true;
    },
    copyChaos: function (item) {
      var _this = this;
      _this.selectChaosData = _this.$util.deepClone(item);
      _this.selectChaosData.id = null;
      _this.chaosDialog.type = 'add';
      _this.chaosDialog.visible = true;
    },
    afterSaveChaos: function () {
      this.chaosDialog.visible = false;
      this.queryChaos();
    },
    deleteChaos: function (item) {
      var _this = this;
      _this.$util.deleteFn(
        _this,
        '操作将会删除编排好的混沌实验:' + item.name,
        designApi + item.id,
        _this.queryChaos
      );
    }
  }
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tool-bar {
  float: left;
  margin-bottom: 20px;
  margin-left: 10px;
}
.inline-input {
  float: right;
  margin-right: 50px;
}
.chaosEditor .el-dialog__body {
  padding: 0;
}
</style>
