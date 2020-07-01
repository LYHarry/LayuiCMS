import { baseApi } from "@/apis";
import { generatorDynamicRouter } from '@/utils/generate-routers'

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
                baseApi.getSystemMenu().then(res => {
                    generatorDynamicRouter(res.data).then(routers => {
                        console.log("getSystemMenu menuData ", routers)
                        commit('SET_ROUTERS', routers)
                        resolve()
                    });
                });

            })
        }
    }
}

export default asyncRouterMap