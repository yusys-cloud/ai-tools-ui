<template>
  <div class="app-container">
    <div class="filter-container">
          <el-input clearable v-model="sd.value" @keyup.enter.native="searchData" placeholder="Keyword" style="width: 200px;" class="filter-item"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"  @click="searchData()">
            Search
          </el-button>
          <el-button v-for="o in lables" size="mini" @click="clickLables(o)">
              {{o.v.name}}
          </el-button>
    </div>
<i class="el-icon-plus"><el-link style="margin-right: 10px;" type="info" @click="handleCreate">Add</el-link></i>
<i class="el-icon-minus"><el-link style="margin-right: 10px;" type="info" @click="deleteData">Delete</el-link></i>
    <el-table stripe v-loading="listLoading" :data="list" @row-dblclick="dbSelected" @selection-change="handleSelectionChange" element-loading-text="Loading" border fit highlight-current-row>
       <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column align="center" label="Index" width="65">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="Data">
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="Bucket" prop="bucket">
              <el-input v-model="temp.bucket" />
            </el-form-item>
            <el-form-item label="Key" prop="key">
              <el-input v-model="temp.key" />
            </el-form-item>
            <el-form-item label="JSON" prop="json">
              <el-input v-model="temp.json" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              Cancel
            </el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
              Confirm
            </el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import { kvReadList,kvSearch,kvCreate,kvUpdate,kvDelete} from '@/api/table'
import waves from '@/directive/waves' // waves directive
export default {
  directives: { waves },
  data() {
    return {
      lables: null,
      list: null,
      listLoading: true,
      temp: {
              bucket: '',
              key: '',
              json: '',
              id: ''
            },
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {update: 'Update',create: 'Create'},
      rules: {
         bucket: [{ required: true, message: 'bucket is required', trigger: 'blur' }],
         key: [{ required: true, message: 'key is required', trigger: 'blur' }],
         json: [{ required: true, message: 'json is required', trigger: 'blur' }]
      },
      sd:{
          "b": "snippets",
          "k": "code",
          "key":"v.name",
          "value":""
      },
      multipleSelection: []
    }
  },
  created() {
    this.fetchLables()
  },
  methods: {
    fetchLables(){
      this.listLoading = true
      kvReadList({'b':'metadata','k':'label'}).then(response => {
        this.lables = response
        this.list = response
        this.listLoading = false
      })
    },
    clickLables(o){
      this.sd.b = o.v.bucket
      this.sd.k = o.v.key
      this.temp.bucket = o.v.bucket
      this.temp.key = o.v.key
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      kvReadList(this.sd).then(response => {
        //console.log(JSON.stringify(response));
        this.list = response
        this.listLoading = false
      })
    },
    searchData(){
      kvSearch(this.sd).then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    dbSelected(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp.bucket = this.sd.b
      this.temp.key = this.sd.k
      this.temp.json = JSON.stringify(row.v)
      this.temp.id = row.k
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.json = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteData(){
      this.multipleSelection.forEach((item, index, arr) => {
          //console.info(item.k)
          this.$confirm('此操作将永久删除'+item.k+', 是否继续?').then(() => {
            kvDelete(this.temp,item.k).then(() => {
              this.fetchData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          kvCreate(this.temp).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          kvUpdate(this.temp,this.temp.id).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
