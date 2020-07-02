import Vue from 'vue'
import VueRouter from 'vue-router'
import RouteRules from './modules/route-rules'
// progress bar
import NProgress from 'nprogress'
// progress bar custom style
import '@/components/NProgress/nprogress.less'
import storage from 'store'


// hack router push callback
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
}


// import notification from 'ant-design-vue/es/notification'
// import { setDocumentTitle, domTitle } from '@/utils/domUtil'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { i18nRender } from '@/locales'
import store from '@/store'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: RouteRules
});

// NProgress Configuration
NProgress.configure({ showSpinner: false })

// no redirect whitelist
const whiteList = ['login', 'register', 'registerResult', 'recoverPassword']
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'



//路由拦截器
router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar

  // console.log('to path ', to)
  // console.log('from path ', from)

  store.dispatch('GenerateRoutes').then(() => {
    //调用后台接口得到可访问菜单列表
    //动态添加可访问路由表
    console.log('store.getters.asyncRoutes ', store.getters.asyncRoutes)
    router.addRoutes(store.getters.asyncRoutes)
  })


  next()

});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});


export default router