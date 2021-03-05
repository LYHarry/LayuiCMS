export default [{
    path: '/401',
    name: 'Error401',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/views/error/401.vue')
},
{
    path: '/500',
    name: 'Error500',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/views/error/500.vue')
},
{
    path: '*',
    name: 'Error404',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/views/error/404.vue')
}
]