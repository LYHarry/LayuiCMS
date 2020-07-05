const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
  userInfo: state => state.user.info,
  userPermissions: state => state.user.permissions,
  asyncRoutes: state => state.user.asyncRoutes,
}

export default getters
