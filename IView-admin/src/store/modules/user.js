// import { login, logout, getUserInfo, getMessage, getContentByMsgId, hasRead, removeReaded, restoreTrash, getUnreadCount } from '@/apis/user'
import cache from '@/libs/cache'
import conf from '@/config'
import apis from '@/apis/modules/base'
import { generatorDynamicRouter } from '@/router/generate-routers'


export default {
  state: {
    // userName: '',
    // userId: '',
    // avatarImgPath: '',
    token: cache.get('token'),
    // access: '',
    // hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    userInfo: {},
    asyncRoutes: [],
  },
  mutations: {
    // setAvatar(state, avatarPath) {
    //   state.avatarImgPath = avatarPath
    // },
    // setUserId(state, id) {
    //   state.userId = id
    // },
    // setUserName(state, name) {
    //   state.userName = name
    // },
    // setAccess(state, access) {
    //   state.access = access
    // },
    setToken(state, token) {
      state.token = token
      cache.set('token', token, conf.cookieExpires || 1)
    },
    // setHasGetInfo(state, status) {
    //   state.hasGetInfo = status
    // },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    setInfo(state, info) {
      state.userInfo = info;
      cache.set('user_info', info, conf.cookieExpires || 1)
    },
    setRouters(state, routers) {
      state.asyncRoutes = routers
    }

  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length,
    asyncRoutes: state => state.asyncRoutes,
  },
  actions: {
    // 登录
    handleLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        apis.login(userInfo).then(res => {
          const data = res.data || {}
          commit('setToken', data.token)
          commit('setInfo', data)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        apis.logout(state.token).then(() => {
          commit('setToken', '')
          commit('setInfo', '')
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        let data = cache.get('user_info') || {}
        resolve(data)
      })
    },
    //调用后台接口得到可访问菜单列表,生成路由
    generateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        apis.getSystemMenu().then(res => {
          generatorDynamicRouter(res.data).then(routers => {
            debugger
            commit('setRouters', routers)
            resolve()
          }).catch(error => reject(error))
        }).catch(error => reject(error))
      })
    },


    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount({ state, commit }) {
      apis.getUnreadCount().then(res => {
        commit('setMessageCount', res.data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}