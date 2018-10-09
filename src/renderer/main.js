import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './assets/i18n/i18n'
import App from './App'
import router from './router'
import store from './store'

import {webFrame} from 'electron'
// fix zoom at 100%, disable the zoom operation
webFrame.setVisualZoomLevelLimits(1, 1)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  components: {App},
  i18n,
  router,
  store,
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')
