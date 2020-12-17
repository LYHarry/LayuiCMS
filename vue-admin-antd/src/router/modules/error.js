import { PageView } from '@/components/Layouts'

export default
    {
        path: '/exception',
        component: PageView,
        redirect: '/exception/404',
        children: [
            {
                path: '403',
                name: 'Exception403',
                component: () => import('@/views/exception/403'),
                meta: {
                    AllowAnonymous: true
                }
            },
            {
                path: '404',
                name: 'Exception404',
                component: () => import('@/views/exception/404'),
                meta: {
                    AllowAnonymous: true
                }
            },
            {
                path: '500',
                name: 'Exception500',
                component: () => import('@/views/exception/500'),
                meta: {
                    AllowAnonymous: true
                }
            }
        ]
    }