import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'
import { Message ,Loading,MessageBox} from 'element-ui'
import Utils from '@/util/util.js'

// 注册全局通用的方法.
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;

// 添加请求拦截器.
axios.interceptors.request.use((request) => {
  // 修改默认超时.10s
  if (request.timeout == 0) {
    // 3s的超时.
    request.timeout = 3000;
  }
  return request;
}, function (error) {
  Message({ type: 'warnning', message: error })
  return Promise.reject(error);
});

// 添加响应拦截器.
axios.interceptors.response.use((response) => {
  if (response.status === 401) {
    //特殊错误处理，状态为10时为登录超时
    Message({ message: "登录已超时，请重新登录", type: 'error' });
  } else if (response.status != 200) {
    //其余错误状态处理
    Message({ message: response.statusText, type: 'error' });
  } else if (response.status === 200) {
    //请求成功
    return response.data;
  }
}, function (error) {
  Message({ type: 'warnning', message: error })
  return Promise.reject(error);
});

Vue.prototype.$axios = axios
Vue.prototype.$loading = Loading
Vue.prototype.$util = Utils


new Vue({
  render: h => h(App),
}).$mount('#app')





