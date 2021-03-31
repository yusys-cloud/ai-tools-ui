<template>
  <div>
    <el-row>
      <el-card>
        <div slot="header" class="card-header">
          <span>演练实验</span>
        </div>
        <div class="tool-bar">
          <el-button @click="chaosDialog.visible = true" size="small">添加</el-button>
          <el-button @click="batchExecChaosTask" size="small">执行</el-button>
        </div>
        <el-autocomplete class="inline-input" v-model="chaosCondition" :fetch-suggestions="chaosFilter" placeholder="输入名称搜索实验" @select="selectChaosData" size="small"></el-autocomplete>
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" ref="chaosTable" :data="chaosList" max-height="500px" @selection-change="handleSelectionChange" :default-sort="{ prop: 'name', order: 'ascending' }">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="实验名称" prop="name" width="200" sortable></el-table-column>
          <el-table-column label="实验描述" prop="desc" width="300"></el-table-column>
          <el-table-column label="执行状态" sortable width="200">
            <template #default="scope">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.status"></el-progress>
            </template>
          </el-table-column>
          <el-table-column label="主机列表">
            <template #default="scope">
              <el-tag v-for="(item, index) in scope.row.chaos" size="medium" :key="item.node.name + index" style="margin-left: 8px">{{ item.node.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200px">
            <template #default="scope">
              <el-button @click="execChaos(scope.row)" type="text" size="small">执行</el-button>
              <el-button @click="editChaos(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="copyChaos(scope.row)" type="text" size="small">复制</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-dialog class="chaosEditor" :visible.sync="chaosDialog.visible" title="演练场景编排" fullscreen :modal-append-to-body="false">
      <chaosEditor />
    </el-dialog>
  </div>
</template>

<script>
import ChaosEditor from "./ChaosEditor.vue";
export default {
  name: "ChaosMgnt",
  components: {
    ChaosEditor,
  },
  data: function () {
    return {
      chaosList: [],
      loading: true,
      total: 0,
      chaosCondition: "",
      selectedChaos: [],
      chaosDialog: {
        visible: false,
      },
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
        .get("/api/kv/chaos/designer")
        .then((data) => {
          if (data) {
            _this.chaosList = _this.$util.arrayKv(data, "id");
          }
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    chaosFilter: function (queryString, cb) {
      //TODO
      console.log(queryString + cb);
    },
    selectChaosData: function (item) {
      // TODO
      console.log("选择数据" + item);
    },
    /**
     * 执行任务.
     */
    execChaos: function (item) {
      // 执行案例.
      var _this = this;
      // TODO 执行混乱测试.
      _this.$message("执行测试案例!" + JSON.stringify(item));
    },
    batchExecChaosTask: function () {
      // 批量执行.
      // 执行案例.
      var _this = this;
      // TODO 执行批量混乱测试.
      _this.$message("暂时未实现批量执行!");
    },
    editChaos: function (item) {
      //TODO 显示编辑面板.
      var _this = this;
      console.log(item);
      _this.$message("暂时未实现编辑!");
    },
    copyChaos: function (item) {
      //TODO 显示编辑面板.
      var _this = this;
      console.log(item);
      _this.$message("暂时未实现复制!");
    },
  },
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
