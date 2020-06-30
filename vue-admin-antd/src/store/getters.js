const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // nickname: state => state.user.name,
  // welcome: state => state.user.welcome,
  // roles: state => state.user.roles,
  userInfo: state => state.user.info,

  asyncRoutes: state => state.asyncRoute.asyncRoutes,
}

export default getters
