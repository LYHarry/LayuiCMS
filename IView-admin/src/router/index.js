import Vue from 'vue'
import VueRouter from 'vue-router'
import RouteRules from './modules/route-rules'
import ViewUI from 'view-design'
import cache from '@/libs/cache'
import conf from '@/config'
import { canTurnTo, setTitle } from '@/libs/utils'
import store from '@/store'

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
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start() //加载进度条

  const token = cache.get('token')
  if (!token && to.name !== 'login') {
    // 未登录且要跳转的页面不是登录页
    next({ name: 'login' }) // 跳转到登录页
  } else if (!token && to.name === 'login') {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    next({ name: conf.homeName })// 跳转到homeName页
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next)
      }).catch(() => {
        cache.set('token', '')
        next({ name: 'login' })
      })
    }
  }
})

router.afterEach(to => {
  // setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})



export default router
