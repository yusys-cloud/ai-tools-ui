<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>Snippets[{{demo.type}}]</span>
    </div>
    <div style="height:300px;">
      <el-form ref="dataForm" :model="demo" :rules="demoRules">
        <el-form-item>
          <el-button v-for="o in snippetsLables" size="mini" @click="clickSnippetsLable(o)">
              {{o.v.name}}
          </el-button>
        </el-form-item>
        <el-form-item>
          <md-input v-model="demo.name" icon="el-icon-search" placeholder="Input">
            Name
          </md-input>
          <md-input  v-model="demo.code" icon="el-icon-search" placeholder="Code snippets">
            Code snippets
          </md-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createData"> Save</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { kvReadList,kvSearch,kvCreate,kvUpdate,kvDelete} from '@/api/table'
import MdInput from '@/components/MDinput'
export default {
  name: 'AddSnippets',
  components: {MdInput},
  data() {
    return {
      demo: {
        type: 'code',
        name: '',
        code: ''
      },
      demoRules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        code: [{ required: true, message: 'code is required', trigger: 'blur' }]
      },
      snippetsLables: []
    }
  },
  created() {
    kvSearch({b:'metadata',k:'label',key:'v.bucket',value:'snippets'}).then(response => {
      this.snippetsLables = response
    })
  },
  methods:{
    clickSnippetsLable(o){
      this.demo.type = o.v.key
    },
    createData() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          kvCreate({bucket: 'snippets',key: this.demo.type,json: {"weight":"0","code": this.demo.code, "name": this.demo.name }}).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.demo.code=''
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
