import cache from '@/libs/cache'
import { LOGIN_USER_INFO } from './mutation-types'

const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
  userInfo: (state) => {
    let stateUserInfo = state.user.info;
    if (stateUserInfo && stateUserInfo.token && stateUserInfo.account && stateUserInfo.id) {
      return stateUserInfo;
    }
    stateUserInfo = cache.get(LOGIN_USER_INFO)
    return stateUserInfo
  },
  userPermissions: state => state.user.permissions,
  asyncRoutes: state => state.user.asyncRoutes,
}

export default getters
