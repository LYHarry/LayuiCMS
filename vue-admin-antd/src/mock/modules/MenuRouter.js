import apiUrl from '@/apis/urls/baseApi'

export default {
    url: apiUrl.systemMenu,
    response: [
        //dashboard
        {
            path: '/dashboard',
            name: 'dashboard',
            redirect: '/dashboard/workplace',
            title: 'menu.dashboard',
            keepAlive: true,
            icon: 'dashboard',
            children: [
                {
                    path: '/dashboard/analysis',
                    name: 'Analysis',
                    component: 'dashboard/Analysis',
                    title: 'menu.dashboard.analysis',
                    keepAlive: false,
                },
                // 外部链接
                {
                    path: 'https://www.baidu.com/',
                    name: 'Monitor',
                    title: 'menu.dashboard.monitor',
                    target: '_blank'
                },
                {
                    path: '/dashboard/workplace',
                    name: 'Workplace',
                    component: 'dashboard/Workplace',
                    title: 'menu.dashboard.workplace',
                    keepAlive: true,
                }
            ]
        },

        // forms
        {
            path: '/form',
            redirect: '/form/base-form',
            title: '表单页',
            icon: 'form',
            children: [
                {
                    path: '/form/base-form',
                    name: 'BaseForm',
                    component: 'form/basicForm',
                    title: '基础表单',
                    keepAlive: true,
                },
                {
                    path: '/form/step-form',
                    name: 'StepForm',
                    component: 'form/stepForm/StepForm',
                    title: '分步表单',
                    keepAlive: true,
                },
                {
                    path: '/form/advanced-form',
                    name: 'AdvanceForm',
                    component: 'form/advancedForm/AdvancedForm',
                    title: '高级表单',
                    keepAlive: true,
                }
            ]
        },

        // list
        {
            path: '/list',
            name: 'list',
            redirect: '/list/table-list',
            title: '列表页',
            icon: 'table',
            children: [
                {
                    path: '/list/table-list/:pageNo([1-9]\\d*)?',
                    name: 'TableListWrapper',
                    hideChildren: true, // 强制显示 MenuItem 而不是 SubMenu
                    component: 'list/TableList',
                    title: '查询表格',
                    keepAlive: true,
                },
                {
                    path: '/list/basic-list',
                    name: 'BasicList',
                    component: 'list/BasicList',
                    title: '标准列表',
                    keepAlive: true,
                },
                {
                    path: '/list/card',
                    name: 'CardList',
                    component: 'list/CardList',
                    title: '卡片列表',
                    keepAlive: true,
                },
                {
                    path: '/list/search',
                    name: 'SearchList',
                    component: 'list/search/SearchLayout',
                    redirect: '/list/search/article',
                    title: '搜索列表',
                    keepAlive: true,
                    children: [
                        {
                            path: '/list/search/article',
                            name: 'SearchArticles',
                            component: 'list/search/Article',
                            title: '搜索列表（文章）',
                        },
                        {
                            path: '/list/search/project',
                            name: 'SearchProjects',
                            component: 'list/search/Projects',
                            title: '搜索列表（项目）',
                        },
                        {
                            path: '/list/search/application',
                            name: 'SearchApplications',
                            component: 'list/search/Applications',
                            title: '搜索列表（应用）',
                        }
                    ]
                }
            ]
        },

        // profile
        {
            path: '/profile',
            name: 'profile',
            redirect: '/profile/basic',
            title: '详情页',
            icon: 'profile',
            children: [
                {
                    path: '/profile/basic',
                    name: 'ProfileBasic',
                    component: 'profile/Basic',
                    title: '基础详情页',
                },
                {
                    path: '/profile/advanced',
                    name: 'ProfileAdvanced',
                    component: 'profile/Advanced',
                    title: '高级详情页',
                }
            ]
        },

        // result
        {
            path: '/result',
            name: 'result',
            redirect: '/result/success',
            title: '结果页',
            icon: 'check-circle-o',
            children: [
                {
                    path: '/result/success',
                    name: 'ResultSuccess',
                    component: 'result/Success',
                    title: '成功',
                    keepAlive: false,
                    hiddenHeaderContent: true,
                },
                {
                    path: '/result/fail',
                    name: 'ResultFail',
                    component: 'result/Error',
                    title: '失败',
                    keepAlive: false,
                    hiddenHeaderContent: true,
                }
            ]
        },

        // Exception
        {
            path: '/exception',
            name: 'exception',
            redirect: '/exception/403',
            title: '异常页',
            icon: 'warning',
            children: [
                {
                    path: '/exception/403',
                    name: 'Exception403',
                    component: 'exception/403',
                    title: '403',
                },
                {
                    path: '/exception/404',
                    name: 'Exception404',
                    component: 'exception/404',
                    title: '404',
                },
                {
                    path: '/exception/500',
                    name: 'Exception500',
                    component: 'exception/500',
                    title: '500',
                }
            ]
        },

        // account
        {
            path: '/account',
            redirect: '/account/center',
            name: 'account',
            title: '个人页',
            icon: 'user',
            keepAlive: true,
            children: [
                {
                    path: '/account/center',
                    name: 'center',
                    component: 'account/center',
                    title: '个人中心',
                    keepAlive: true,
                },
                {
                    path: '/account/settings',
                    name: 'settings',
                    component: 'account/settings/Index',
                    title: '个人设置',
                    hideHeader: true,
                    redirect: '/account/settings/base',
                    hideChildren: true,
                    children: [
                        {
                            path: '/account/settings/base',
                            name: 'BaseSettings',
                            component: 'account/settings/BaseSetting',
                            title: '基本设置',
                            hidden: true,
                        },
                        {
                            path: '/account/settings/security',
                            name: 'SecuritySettings',
                            component: 'account/settings/Security',
                            title: '安全设置',
                            hidden: true,
                            keepAlive: true,
                        },
                        {
                            path: '/account/settings/custom',
                            name: 'CustomSettings',
                            component: 'account/settings/Custom',
                            title: '个性化设置',
                            hidden: true,
                            keepAlive: true,
                        },
                        {
                            path: '/account/settings/binding',
                            name: 'BindingSettings',
                            component: 'account/settings/Binding',
                            title: '账户绑定',
                            hidden: true,
                            keepAlive: true,
                        },
                        {
                            path: '/account/settings/notification',
                            name: 'NotificationSettings',
                            component: 'account/settings/Notification',
                            title: '新消息通知',
                            hidden: true,
                            keepAlive: true,
                        }
                    ]
                }
            ]
        },

        // other
        {
            path: '/other',
            name: 'otherPage',
            component: 'PageView',
            title: '其他组件',
            icon: 'slack',
            redirect: '/other/icon-selector',
            children: [
                {
                    path: '/other/icon-selector',
                    name: 'TestIconSelect',
                    component: 'other/IconSelectorView',
                    title: 'IconSelector',
                    icon: 'tool',
                    keepAlive: true,
                },
                {
                    path: '/other/list',
                    title: '业务布局',
                    icon: 'layout',
                    redirect: '/other/list/tree-list',
                    children: [
                        {
                            path: '/other/list/tree-list',
                            name: 'TreeList',
                            component: 'other/TreeList',
                            title: '树目录表格',
                            keepAlive: true
                        },
                        {
                            path: '/other/list/edit-table',
                            name: 'EditList',
                            component: 'other/TableInnerEditList',
                            title: '内联编辑表格',
                            keepAlive: true
                        },
                        {
                            path: '/other/list/user-list',
                            name: 'UserList',
                            component: 'other/UserList',
                            title: '用户列表',
                            keepAlive: true
                        },
                        {
                            path: '/other/list/role-list',
                            name: 'RoleList',
                            component: 'other/RoleList',
                            title: '角色列表',
                            keepAlive: true
                        },
                        {
                            path: '/other/list/system-role',
                            name: 'SystemRole',
                            component: 'role/RoleList',
                            title: '角色列表2',
                            keepAlive: true
                        },
                        {
                            path: '/other/list/permission-list',
                            name: 'PermissionList',
                            component: 'other/PermissionList',
                            title: '权限列表',
                            keepAlive: true
                        }
                    ]
                }
            ]
        }
    ]
}