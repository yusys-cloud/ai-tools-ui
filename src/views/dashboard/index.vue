<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Quick Start</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn pink-btn" to="/ssh/index">
              SSH
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn light-blue-btn" to="/json/index">
              JSON store
            </router-link>
          </el-col>
        </div>
      </el-card>
    </el-row>

    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="6">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { kvReadList,kvSearch,kvCreate,kvUpdate,kvDelete} from '@/api/table'
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  name: 'ComponentMixinDemo',
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu
  },
  directives: {
    waves
  },
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

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>
