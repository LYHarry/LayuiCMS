import Vue from 'vue'
import VueRouter from 'vue-router'
import RouteRules from './modules/route-rules'
import ViewUI from 'view-design'
import cache from '@/libs/cache'
import conf from '@/config'
import { canTurnTo, setTitle } from '@/libs/utils'
import store from '@/store' // Vuex

// hack router push callback
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history', // history  hash
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: RouteRules
});

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, RouteRules)) next() // 有权限，可访问
  else next({ replace: true, name: 'Error401' }) // 无权限，重定向到401页面
}

const whiteList = ['login'] //路由白名单
const loginRoute = 'login' //登录页面

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start() //加载进度条

  debugger
  const token = cache.get('token');
  console.log('token ', token)
  //未登录
  if (!cache.get('token')) {
    // 未登录,但在免登录白名单或该页面允许匿名访问,则直接进入
    if (whiteList.includes(to.name) || to.meta.AllowAnonymous) {
      return next()
    }
    // 跳转到登录页
    return next({ name: loginRoute, query: { redirect: to.fullPath } })
  }
  // 已登录且要跳转的页面是登录页
  if (to.name === loginRoute) {
    return next({ name: conf.homeName })  // 跳转到homeName页
  }
  console.log('store.getters.asyncRoutes ', store.getters.asyncRoutes)
  if (store.getters.asyncRoutes.length !== 0) {
    return next();
  }
  // generate dynamic router
  store.dispatch('generateRoutes').then(() => {
    debugger
    // 动态添加可访问路由表
    router.addRoutes(store.getters.asyncRoutes)
    // 请求带有 redirect 重定向时，登录自动重定向到该地址
    const redirect = decodeURIComponent(from.query.redirect || to.path)
    if (to.path === redirect) {
      // set the replace: true so the navigation will not leave a history record
      return next({ ...to, replace: true })
    }
    // 跳转到目的路由
    return next({ path: redirect })
  }).catch((e) => {
    debugger
    // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
    store.dispatch('handleLogOut').finally((e) => {
      return next({ name: loginRoute, query: { redirect: to.fullPath } })
    });
  })

})

router.afterEach(to => {
  // setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router