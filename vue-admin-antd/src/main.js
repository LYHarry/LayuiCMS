import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'
import i18n from '@/locales'

import '@/utils/lazy_use'
import '@/assets/style/global.less'
import '@/mock/MockServer'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')