import Vue from 'vue'
import VueRouter from 'vue-router'
import RouteRules from './modules/route-rules'
// progress bar
import NProgress from 'nprogress'
// progress bar custom style
import '@/components/NProgress/nprogress.less'
import cache from '@/libs/cache'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle } from '@/libs/utils'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import store from '@/store' // Vuex
import config from '@/config'

// hack router push callback
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history', // history/hash
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
  // 设置页面title
  to.meta && to.meta.title && setDocumentTitle(`${i18nRender(to.meta.title)} - ${config.title}`)
  // token 存在表示已登录
  if (cache.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
      return true;
    }
    // check login user.permissions is null
    if (store.getters.userPermissions.length !== 0) {
      next();
      return true;
    }
    // request login userInfo get user permissions
    // generate dynamic router
    store.dispatch('GenerateRoutes').then(() => {
      // 动态添加可访问路由表
      router.addRoutes(store.getters.asyncRoutes)
      // 请求带有 redirect 重定向时，登录自动重定向到该地址
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        // set the replace: true so the navigation will not leave a history record
        next({ ...to, replace: true })
        return true;
      }
      // 跳转到目的路由
      next({ path: redirect })
    }).catch(() => {
      notification.error({ message: '错误', description: '请求用户权限失败，请重试' })
      // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
      store.dispatch('Logout').then(() => {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      })
    })
    return true;
  }

  // 未登录,但在免登录白名单，直接进入
  if (whiteList.includes(to.name)) {
    next()
    return true;
  }
  next({ path: loginRoutePath, query: { redirect: to.fullPath } })
  // if current page is login will not trigger afterEach hook, so manually handle it
  NProgress.done()

});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});


export default router