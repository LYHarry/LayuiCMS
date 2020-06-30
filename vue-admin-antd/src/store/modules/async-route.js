import { baseApi } from "@/apis";
import { bxAnaalyse } from "@/utils/icons";

const asyncRouterMap = {
    state: {
        routers: [],
        asyncRoutes: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.asyncRoutes = routers
            state.routers = [].concat(routers)
        }
    },
    actions: {
        //调用后台接口得到可访问菜单列表,生成路由
        GenerateRoutes({ commit }) {
            return new Promise(resolve => {
                baseApi.getSystemMenu().then(res => {
                    let menuData = res.data.reduce((prev, cur, index, arr) => {
                        let menuItem = {
                            path: cur.path,
                            redirect: cur.redirect,
                            component: cur.component,
                            name: cur.name,
                            meta: { title: cur.title, icon: cur.icon },
                            children: []
                        };
                        if (menuItem.name === "dashboard") {
                            menuItem.meta.icon = bxAnaalyse;
                        }
                        menuItem.children = cur.children.reduce((prev, cur, index, arr) => {
                            prev.push({
                                path: cur.path,
                                name: cur.name,
                                component: () => import("@" + cur.component),
                                meta: {
                                    title: cur.title,
                                    keepAlive: cur.keepAlive,
                                    target: cur.target || ""
                                }
                            });
                            return prev;
                        }, []);
                        prev.push(menuItem);
                        return prev;
                    }, []);
                    console.log("getSystemMenu menuData ", menuData)
                    commit('SET_ROUTERS', menuData)
                    resolve()
                });

            })
        }
    }
}

export default asyncRouterMap