import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locales'

// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

// Vue.use(Antd)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')