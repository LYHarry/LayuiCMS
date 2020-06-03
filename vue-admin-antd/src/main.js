import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'
import i18n from '@/locales'
// import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

import '@/utils/lazy_use'
import '@/assets/style/global.less'

// Vue.component('pro-layout', ProLayout)
// Vue.component('page-header-wrapper', PageHeaderWrapper)

console.log('process.env ', process.env)

//开发环境并且允许 mock 数据是开启 MockServer
if (process.env.NODE_ENV === 'development') {
  require('@/mock/MockServer')
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')