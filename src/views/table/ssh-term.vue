<template>
	<el-card class="box-card" style="width: 48%;float: left;">
	    <div slot="header" class="clearfix">
		  <el-checkbox v-model="shareInput" @change="changeShareInput"></el-checkbox>input sharing&nbsp;
	      <span>{{vm.host}}</span>
	      <el-button style="float: right; padding: 3px 0" type="text" @click="terminalClose">x</el-button>
	    </div>
	</el-card>
</template>

<script>
	import 'xterm/css/xterm.css'
	import { Terminal } from 'xterm';
	import { FitAddon } from 'xterm-addon-fit';
	export default {
	  name: 'WebTerminal',
	  props: {
	    msg: String,
		vm: {},
		batchIds: Array
	  },
	  data() {
	  	return {
	  		term: null,
			socket: null,
			options: null,
			isFirst: true,
			shareInput: true,
			sessionId: ""
	  	}
	  },
	  mounted() {
		this.options = this.vm
		this.socketConnect()
	  },
	  methods:{
		  initTerminal(){
			  this.term = new Terminal({
			  	// cols: 200,
			  	rows: 20,
			  	cursorBlink: true, // 光标闪烁
			  	cursorStyle: "block", // 光标样式  null | 'block' | 'underline' | 'bar'
			  	scrollback: 800, //回滚
			  	tabStopWidth: 8, //制表宽度
			  	screenKeys: true,
			  	fontSize: 15
			  });
			  const fitAddon = new FitAddon();
			  this.term.loadAddon(fitAddon);
			  this.term.open(this.$el,true);
			  this.term.write('Connecting...');
			  fitAddon.fit()
			  this.term.onData(this.socketSendMessage)
		  },
		  socketOpen: function(){
		  		console.log("Socket connected...")
				this.initTerminal()
		  		this.options.operate = 'connect'
		  		this.socket.send(JSON.stringify(this.options))
		  },
		  socketReciveMessage:function(msg){
				if(this.isFirst){
					this.sessionId=msg.data
					this.isFirst = false
					this.$emit('shareInputStatus',this.sessionId,true)
				}else{
					this.term.write(msg.data)
				}
		  },
		  socketSendMessage:function(data){
			  console.info(this.batchIds)
			  this.socket.send(JSON.stringify({"operate": "batchCommand", "command": data,"sessionIds":this.batchIds}))
		  },
		  socketConnect(){
		  	// this.socket = new WebSocket("ws://localhost:8000/webssh")
			this.socket = new WebSocket(this.getURL())
		  	this.socket.onopen = this.socketOpen
		  	this.socket.onerror = function(){
		  		console.error("Socket error")
		  	}
		  	this.socket.onmessage = this.socketReciveMessage
		  },
		  terminalClose(){
			  this.$el.remove()
			  this.socket.close()
			  this.term.clear()
			  this.$emit('shareInputStatus',this.sessionId,false)
		  },
		  getURL(){
			  if (window.location.protocol == 'https:') {
			          var protocol = 'wss://';
			      } else {
			          var protocol = 'ws://';
			      }
			  var endpoint = protocol+window.location.host+'/webssh';
			  return endpoint;
		  },
		  changeShareInput(){
			  this.$emit('shareInputStatus',this.sessionId,this.shareInput)
		  }
	  },
	  beforeDestroy() {
	  	console.info("term destory")
	  }
	}
</script>

<style>
</style>
