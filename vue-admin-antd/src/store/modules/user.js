import cache from '@/libs/cache'
import { ACCESS_TOKEN, LOGIN_USER_INFO } from '@/store/mutation-types'
import * as apis from '@/apis/modules/baseApi'
import { generatorDynamicRouter } from '@/libs/generate-routers'

const user = {
  state: {
    token: '',
    info: {},
    permissions: [],
    asyncRoutes: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROUTERS: (state, routers) => {
      state.asyncRoutes = routers
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        apis.login(userInfo).then(response => {
          if (!(response.code === 200 && response.success)) {
            return reject(response);
          }
          const result = response.data
          cache.set(ACCESS_TOKEN, result.token, 2 * 60 * 60)
          cache.set(LOGIN_USER_INFO, result, 2 * 60 * 60)
          commit('SET_TOKEN', result.token)
          commit('SET_INFO', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        apis.logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_INFO', '')
          commit('SET_PERMISSIONS', [])
          commit('SET_ROUTERS', [])
          cache.remove(ACCESS_TOKEN)
          cache.remove(LOGIN_USER_INFO)
        })
      })
    },
    //调用后台接口得到可访问菜单列表,生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        apis.getSystemMenu().then(res => {
          generatorDynamicRouter(res.data).then(routers => {
            commit('SET_ROUTERS', routers)
            commit('SET_PERMISSIONS', res.data)
            resolve()
          }).catch(error => reject(error))
        }).catch(error => reject(error))
      })
    },





  }


}


export default user