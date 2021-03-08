import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, getNextRoute, routeHasExist, routeEqual, getRouteTitleHandled, localSave, localRead } from '@/libs/utils'
import apis from '@/apis/modules/base'
import router from '@/router'
import conf from '@/config'
import { generatorDynamicRouter } from '@/router/generate-routers'
import cache from '@/libs/cache'

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: cache.get('local') || '',
    errorList: [],
    hasReadErrorPage: false,
    asyncRoutes: [],
  },
  getters: {
    menuList: state => getMenuByRouter(state.asyncRoutes),
    errorCount: state => state.errorList.length,
    asyncRoutes: state => state.asyncRoutes,
  },
  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, conf.homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== conf.homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === conf.homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag(state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === conf.homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      cache.set('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    },
    setRouters(state, routers) {
      state.asyncRoutes = routers
    }
  },
  actions: {
    addErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      apis.saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    //调用后台接口得到可访问菜单列表,生成路由
    generateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        apis.getSystemMenu().then(res => {
          generatorDynamicRouter(res.data).then(routers => {
            commit('setRouters', routers)
            resolve()
          }).catch(error => reject(error))
        }).catch(error => reject(error))
      })
    },

  }
}