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
              <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.status" />
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
              <el-button type="text" size="small" @click="copyChaos(scope.row)">复制</el-button>
              <el-button type="text" size="small" @click="deleteChaos(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-dialog class="chaosEditor" :visible.sync="chaosDialog.visible" title="演练场景编排" fullscreen>
      <chaosEditor :chaos-data="selectChaosData" :type="chaosDialog.type" :after-save-chaos="afterSaveChaos" />
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
      _this.$axios
        .get(designApi)
        .then((data) => {
          if (data) {
            var array = _this.$util.arrayKv(data, 'id');
            _this.chaosList = array;
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
      _this.$util.runFn(_this, designApi + 'run/' + item.id, () => {
        _this.$message('执行混沌测试:[' + item.name + ']成功!');
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
      this.chaosDialog.visible = true;
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
