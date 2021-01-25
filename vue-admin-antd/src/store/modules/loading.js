
const loading = {
  state: {
    table: false,
    ajax: false,
  },

  mutations: {
    SET_TABLE_LOADING(state, loading) {
      state.table = loading
    },
    SET_AJAX_LOADING(state, loading) {
      state.ajax = loading
    },
  },

  actions: {
    showTableLoading(state) {
      return new Promise((resolve) => {
        state.commit("SET_TABLE_LOADING", true);
        resolve(true)
      })
    },
    hideTableLoading(state) {
      return new Promise((resolve) => {
        state.commit("SET_TABLE_LOADING", false);
        resolve(true)
      })
    },
    showAjaxLoading(state) {
      return new Promise((resolve) => {
        state.commit("SET_AJAX_LOADING", true);
        resolve(true)
      })
    },
    hideAjaxLoading(state) {
      return new Promise((resolve) => {
        state.commit("SET_AJAX_LOADING", false);
        resolve(true)
      })
    },
  }

}


export default loading