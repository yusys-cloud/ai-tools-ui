<template>
  <div class="mixin-components-container">
      <el-row>
        <el-col :span="3">
            <el-divider content-position="left">Nodes</el-divider>
            <el-button v-for="o in nodes" size="mini" @click="openWs(o.v)">{{o.v.name}}[{{o.v.host}}]</el-button>
        </el-col>
        <el-col :span="21">
          <el-card class="box-card">
            <Console :terminal="terminal" ref="console"></Console>
            <el-divider content-position="left">Commands
             <!-- <el-input clearable v-model="sCode" size="small" @keyup.enter.native="searchCodes" placeholder="Keyword" style="width: 250px;"/> -->
            </el-divider>
            <el-tooltip v-for="o,i in codes" class="item" effect="dark" :content="o.v.code" placement="bottom-start">
              <el-button plain size="mini" type="success" @click="setCode(o,i)" style="margin-bottom: 0.625rem;">{{o.v.name}}</el-button>
            </el-tooltip>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>

<script>
	import Console from './console'
  import splitPane from 'vue-splitpane';
  import { kvReadList,kvSearch,kvUpdateWeight} from '@/api/table'
	export default {
	  name: 'WebTerminal',
    components: { splitPane,Console},
	  data() {
	  	return {
        nodes: [],
        codes: [],
        sCode: '',
        fontSize: 10,
        terminal: {
                            pid: 1,
                            name: 'terminal',
                            cols: 400,
                            rows: 400
        },
	  	}
	  },
	  mounted() {
	  },
    created() {
      kvReadList({'b':'metadata','k':'node'}).then(response => {
        this.nodes = response
      })
      kvSearch({b:'snippets',k:'code',shortBy:'v.weight,desc'}).then(response => {
        this.codes = response
      })
    },
	  methods:{
      openWs(node){
        let u = new URLSearchParams(node).toString();
        this.$refs.console.openWS(this.getURL()+'/api/ws?'+u);
      },
      setCode(c,index){
        this.$refs.console.wsSend(c.v.code);
        this.$refs.console.term.focus()

        kvUpdateWeight({bucket:'snippets',key:'code'},c.k).then(response => {})
        this.codes.splice(index,1)
        this.codes.unshift(c)
      },
      searchCodes(){
        kvSearch({b:'snippets',k:'code',key:'',value:this.sCode}).then(response => {
          this.list = response
          this.listLoading = false
        })
      },
      getURL(){
          var protocol = 'ws://';
          if (window.location.protocol == 'https:') {
                 protocol = 'wss://';
          }
          if (process.env.VUE_APP_BASE_API === '') {
            protocol = protocol+window.location.host;
          }else{
            protocol = protocol+process.env.VUE_APP_BASE_API.substring(7)
          }
          console.info(protocol)
          return protocol
      }
	},
  }
</script>
<style  scoped>
  .components-container {
    position: relative;
    height: 100vh;
  }
  .left-container {
    /* background-color: #DCDFE6; */
    height: 100%;
  }
  .right-container {
    background-color: #E4E7ED;
    height: 200px;
  }
  .top-container {
    background-color: #F2F6FC;
    width: 100%;
    height: 100%;
  }
  .bottom-container {
    width: 100%;
    background-color: #F2F6FC;
    height: 100%;
  }
</style>
