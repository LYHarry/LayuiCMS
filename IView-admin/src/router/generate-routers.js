'use strict'

import BasicLayout from '_c/layouts/BasicLayout'
import ParentView from '_c/layouts/ParentView'

// 前端路由表
const constantRouterComponents = {
    // 基础页面 layout 必须引入
    BasicLayout: BasicLayout,
    ParentView: ParentView,
}

// 前端未找到页面路由
const notFoundRouter = {
    path: '*',
    redirect: '/404',
    meta: {
        hideInMenu: true
    },
}


/**
 * 动态生成菜单
 */
export const generatorDynamicRouter = (menuData) => {
    return new Promise(resolve => {
        //格式化树形结构数据 生成 vue-router 层级路由表
        const routers = generator(menuData)
        //添加404页面
        routers.push(notFoundRouter)
        resolve(routers)
    })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 */
const generator = (routerMap, parent) => {
    return routerMap.map(item => {
        item.meta = JSONMeta(item);
        const { hideInMenu, icon, hideInBread } = item.meta;
        const curRouter = {
            // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
            path: item.linkurl || item.path || `${parent && parent.path || ''}/${item.eName}`,
            // 该路由对应页面的组件(动态加载)
            component: getComponentUrl(item),
            // 路由名称，建议唯一
            name: item.eName || item.name || '',
            // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
            meta: {
                ...item.meta,
                title: item.cName || item.title || '',
                icon: icon || item.icon,
                permission: item.menuActions || item.permission,
                hideInBread: hideInBread === true, // 是否隐藏面包屑        
                hideInMenu: hideInMenu === true,   // 是否隐藏菜单
            }
        }
        // 重定向
        item.redirect && (curRouter.redirect = item.redirect)
        // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
        if (!curRouter.path.startsWith('http')) {
            curRouter.path = curRouter.path.replace('//', '/')
        }
        // 是否有子菜单，并递归处理
        if (Array.isArray(item.children) && item.children.length > 0) {
            curRouter.children = generator(item.children, curRouter)
        }
        return curRouter
    })
}

const JSONMeta = (item) => {
    try {
        let metaObj = item.extend && JSON.parse(item.extend);
        if (metaObj && Object.keys(metaObj).length > 0)
            return metaObj;
    } catch (error) {
        console.error('序列化路由 meta 数据出错: ' + error);
    }
    return item.meta || {};
}

const getComponentUrl = (item) => {
    let viewurl = item.viewurl || item.component;
    let baseComponent = constantRouterComponents[viewurl || 'BasicLayout'];
    if (baseComponent) return baseComponent;
    if (!viewurl) return null;
    return (() => import(`@/views${item.viewurl || item.component}.vue`));
}