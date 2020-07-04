import { generatorDynamicRouter } from '@/utils/generate-routers'
import { getSystemMenu } from '@/apis/modules/baseApi'

const asyncRouterMap = {
    state: {
        routers: [],
        asyncRoutes: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.asyncRoutes = routers;
            state.routers = [].concat(routers)
        }
    },
    actions: {
        //调用后台接口得到可访问菜单列表,生成路由
        GenerateRoutes({ commit }) {
            return new Promise(resolve => {
                getSystemMenu().then(res => {
                    generatorDynamicRouter(res.data).then(routers => {
                        commit('SET_ROUTERS', routers)
                        resolve()
                    });
                });

            })
        }
    }
}

export default asyncRouterMap