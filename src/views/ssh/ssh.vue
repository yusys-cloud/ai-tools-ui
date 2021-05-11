<template>
  <div class="mixin-components-container">
      <el-row>
        <el-col :span="3">
            <el-divider content-position="left">Nodes</el-divider>
            <el-button v-for="o in nodes" size="mini" @click="openWs(o.v)">{{o.v.name}}[{{o.v.host}}]</el-button>
        </el-col>
        <el-col :span="21">
          <el-card class="box-card">
            <div ref="terminal"></div>
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
	import 'xterm/css/xterm.css'
	import { Terminal } from 'xterm';
	import { FitAddon } from 'xterm-addon-fit';
  import splitPane from 'vue-splitpane';
  import { kvReadList,kvSearch,kvUpdateWeight} from '@/api/table'
	export default {
	  name: 'WebTerminal',
    components: { splitPane },
	  data() {
	  	return {
	  		term: null,
        ws: null,
        nodes: [],
        codes: [],
        sCode: '',
        fontSize: 10
	  	}
	  },
	  mounted() {
      this.initTerminal()
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
		  initTerminal(){
			  this.term = new Terminal({
			  	// cols: 200,
			  	rows: 30,
			  	cursorBlink: true, // 光标闪烁
			  	cursorStyle: "block", // 光标样式  null | 'block' | 'underline' | 'bar'
			  	scrollback: 800, //回滚
			  	tabStopWidth: 8, //制表宽度
			  	screenKeys: true,
			  	fontSize: this.fontSize
			  });
        this.term.open(this.$refs.terminal);
			  const fitAddon = new FitAddon();
			  this.term.loadAddon(fitAddon);
			  fitAddon.fit()
		  },
      wsSend(data){
         this.ws.send(JSON.stringify({type: 'cmd', cmd: data}))
      },
      wsRecive(ev){
         this.term.write(ev.data)
      },
      wsOpened(){
        this.term.writeln("WebSocket connected")
        this.term.focus()
      },
      openWs(node){
        //this.term.reset()
        this.term.write(node.host+' Connecting...');
        let u = new URLSearchParams(node).toString();
        this.ws = new WebSocket(this.getURL()+'/api/ws?'+u)
        this.ws.onopen = this.wsOpened
        this.ws.onmessage = this.wsRecive
        this.ws.onerror = function(){
        		  		console.error("Socket error")
        		  	}
        this.term.onData(this.wsSend)
      },
      setCode(c,index){
        if(this.ws){
          this.wsSend(c.v.code)
          this.term.focus()
        }
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
