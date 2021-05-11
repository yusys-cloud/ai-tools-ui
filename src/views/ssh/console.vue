<template>
  <div class="console"
       id="terminal"></div>
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm';
export default {
  name: 'Console',
  props: {
    terminal: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    url: ''
  },
  data () {
    return {
      term: null,
      terminalSocket: null
    }
  },
  methods: {
    runRealTerminal () {
      console.log('webSocket is finished')
    },
    errorRealTerminal () {
      console.log('error')
    },
    closeRealTerminal () {
      console.log('close')
    },
    wsRecive(ev){
       this.term.write(ev.data)
    },
    wsSend(data){
       this.terminalSocket.send(data)
    },
    // open websocket
    openWS(url){
      this.url = url
      this.terminalSocket = new WebSocket(this.url)
      this.terminalSocket.onopen = this.runRealTerminal
      this.terminalSocket.onclose = this.closeRealTerminal
      this.terminalSocket.onerror = this.errorRealTerminal
      this.terminalSocket.onmessage = this.wsRecive
      this.term.onData(this.wsSend)
    }
  },
  mounted () {
    console.log('pid : ' + this.terminal.pid + ' is on ready')
    let terminalContainer = document.getElementById('terminal')
    this.term = new Terminal()
    this.term.open(terminalContainer)
    console.log(this.url)
    this.term._initialized = true
    console.log('mounted is going on')
  },
  beforeDestroy () {
    this.terminalSocket.close()
    this.term.destroy()
  }
}
</script>
