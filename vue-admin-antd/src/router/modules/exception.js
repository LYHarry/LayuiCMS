const RouteView = {
    name: 'RouteView',
    render: (h) => h('router-view')
}

export default {
    path: '/exception',
    name: 'exception',
    component: RouteView,
    redirect: '/exception/403',
    meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
    children: [
        {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import('@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
        },
        {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import('@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
        },
        {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import('@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
        }
    ]
}