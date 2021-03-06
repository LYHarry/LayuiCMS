import { UserLayout } from '@/components/Layouts'

export default {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
    },
    {
        path: 'register',
        name: 'register',
        component: () => import('@/views/user/Register')
    },
    {
        path: 'register-result',
        name: 'registerResult',
        component: () => import('@/views/user/RegisterResult'),
        meta: {
            AllowAnonymous: true
        }
    },
    {
        path: 'recover',
        name: 'recoverPassword',
        component: () => import('@/views/user/RecoverPassword'),
        meta: {
            AllowAnonymous: true
        }
    }
    ]
}