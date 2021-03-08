import BasicLayout from '@/components/layouts/BasicLayout'

export default [{
    path: '/login',
    name: 'login',
    title: 'Login - 登录',
    meta: {
        hideInMenu: true
    },
    component: () => import('@/views/login/Login.vue')
}
]