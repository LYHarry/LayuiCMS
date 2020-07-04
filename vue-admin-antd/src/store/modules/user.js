import cache from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { login } from '@/apis/modules/baseApi'

const user = {
  state: {
    token: '',
    // welcome: '',
    // roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          if (response.code !== 200) {
            return reject(result);
          }
          cache.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          commit('SET_INFO', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },





  }


}


export default user
