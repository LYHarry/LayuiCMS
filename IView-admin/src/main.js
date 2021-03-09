import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'

import './libs/lazy_use'
import './assets/style/global.less' // global style

console.log('envConfig ', envConfig)

//开发环境并且允许 mock 数据是开启 MockServer
if (process.env.NODE_ENV === 'development') {
  require('./mock/mock-server')
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')