import apiUrl from '@/apis/urls/baseApi'

export default {
    type: 'get',
    url: apiUrl.systemMenu,
    response: [{
        path: '/',
        name: 'MainHome',
        redirect: '/home',
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [{
            path: '/home',
            name: 'home',
            icon: 'md-home',
            title: '首页',
            meta: {
                hideInMenu: true,
                notCache: true,
            },
            component: '/single-page/home'
        }
        ]
    },
    {
        path: '',
        name: 'doc',
        icon: 'ios-book',
        title: '文档',
        meta: {
            href: 'https://lison16.github.io/iview-admin-doc',
        }
    },
    {
        path: '/join',
        name: 'join',
        meta: {
            hideInBread: true
        },
        children: [{
            path: 'join_page',
            name: 'join_page',
            icon: '_qq',
            title: 'QQ群',
            component: '/join-page'
        }
        ]
    },
    {
        path: '/message',
        name: 'message',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [{
            path: 'message_page',
            name: 'message_page',
            icon: 'md-notifications',
            title: '消息中心',
            component: '/single-page/message/index'
        }
        ]
    },
    {
        path: '/components',
        name: 'components',
        icon: 'logo-buffer',
        title: '组件',
        children: [{
            path: 'tree_select_page',
            name: 'tree_select_page',
            icon: 'md-arrow-dropdown-circle',
            title: '树状下拉选择器',
            component: '/components/tree-select/index'
        },
        {
            path: 'count_to_page',
            name: 'count_to_page',
            icon: 'md-trending-up',
            title: '数字渐变',
            component: '/components/count-to/count-to'
        },
        {
            path: 'drag_list_page',
            name: 'drag_list_page',
            icon: 'ios-infinite',
            title: '拖拽列表',
            component: '/components/drag-list/drag-list'
        },
        {
            path: 'drag_drawer_page',
            name: 'drag_drawer_page',
            icon: 'md-list',
            title: '可拖拽抽屉',
            component: '/components/drag-drawer'
        },
        {
            path: 'org_tree_page',
            name: 'org_tree_page',
            icon: 'ios-people',
            title: '组织结构树',
            component: '/components/org-tree'
        },
        {
            path: 'tree_table_page',
            name: 'tree_table_page',
            icon: 'md-git-branch',
            title: '树状表格',
            component: '/components/tree-table/index'
        },
        {
            path: 'cropper_page',
            name: 'cropper_page',
            icon: 'md-crop',
            title: '图片裁剪',
            component: '/components/cropper/cropper'
        },
        {
            path: 'tables_page',
            name: 'tables_page',
            icon: 'md-grid',
            title: '多功能表格',
            component: '/components/tables/tables'
        },
        {
            path: 'split_pane_page',
            name: 'split_pane_page',
            icon: 'md-pause',
            title: '分割窗口',
            component: '/components/split-pane/split-pane'
        },
        {
            path: 'markdown_page',
            name: 'markdown_page',
            icon: 'logo-markdown',
            title: 'Markdown编辑器',
            component: '/components/markdown/markdown'
        },
        {
            path: 'editor_page',
            name: 'editor_page',
            icon: 'ios-create',
            title: '富文本编辑器',
            component: '/components/editor/editor'
        },
        {
            path: 'icons_page',
            name: 'icons_page',
            icon: '_bear',
            title: '自定义图标',
            component: '/components/icons/icons'
        }
        ]
    },
    {
        path: '/update',
        name: 'update',
        icon: 'md-cloud-upload',
        title: '数据上传',
        children: [{
            path: 'update_table_page',
            name: 'update_table_page',
            icon: 'ios-document',
            title: '上传Csv',
            component: '/update/update-table'
        },
        {
            path: 'update_paste_page',
            name: 'update_paste_page',
            icon: 'md-clipboard',
            title: '粘贴表格数据',
            component: '/update/update-paste'
        }
        ]
    },
    {
        path: '/excel',
        name: 'excel',
        icon: 'ios-stats',
        title: 'EXCEL导入导出',
        children: [{
            path: 'upload-excel',
            name: 'upload-excel',
            icon: 'md-add',
            title: '导入EXCEL',
            component: '/excel/upload-excel'
        },
        {
            path: 'export-excel',
            name: 'export-excel',
            icon: 'md-download',
            title: '导出EXCEL',
            component: '/excel/export-excel'
        }
        ]
    },
    {
        path: '/tools_methods',
        name: 'tools_methods',
        meta: {
            hideInBread: true
        },
        children: [{
            path: 'tools_methods_page',
            name: 'tools_methods_page',
            icon: 'ios-hammer',
            title: '工具方法',
            meta: {
                beforeCloseName: 'before_close_normal'
            },
            component: '/tools-methods/tools-methods'
        }
        ]
    },
    {
        path: '/i18n',
        name: 'i18n',
        meta: {
            hideInBread: true
        },
        children: [{
            path: 'i18n_page',
            name: 'i18n_page',
            icon: 'md-planet',
            title: 'i18n - {{ i18n_page }}',
            component: '/i18n/i18n-page'
        }
        ]
    },
    {
        path: '/error_store',
        name: 'error_store',
        meta: {
            hideInBread: true
        },
        children: [{
            path: 'error_store_page',
            name: 'error_store_page',
            icon: 'ios-bug',
            title: '错误收集',
            component: '/error-store/error-store'
        }
        ]
    },
    {
        path: '/error_logger',
        name: 'error_logger',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [{
            path: 'error_logger_page',
            name: 'error_logger_page',
            icon: 'ios-bug',
            title: '错误收集',
            component: '/single-page/error-logger'
        }
        ]
    },
    {
        path: '/directive',
        name: 'directive',
        meta: {
            hideInBread: true
        },
        children: [{
            path: 'directive_page',
            name: 'directive_page',
            icon: 'ios-navigate',
            title: '指令',
            component: '/directive/directive'
        }
        ]
    },
    {
        path: '/multilevel',
        name: 'multilevel',
        icon: 'md-menu',
        title: '多级菜单',
        children: [{
            path: 'level_2_1',
            name: 'level_2_1',
            icon: 'md-funnel',
            title: '二级-1',
            component: '/multilevel/level-2-1'
        },
        {
            path: 'level_2_2',
            name: 'level_2_2',
            icon: 'md-funnel',
            title: '二级-2',
            meta: {
                access: ['super_admin'],
                showAlways: true,
            },
            component: 'parentView',
            children: [{
                path: 'level_2_2_1',
                name: 'level_2_2_1',
                icon: 'md-funnel',
                title: '三级',
                component: '/multilevel/level-2-2/level-2-2-1'
            },
            {
                path: 'level_2_2_2',
                name: 'level_2_2_2',
                icon: 'md-funnel',
                title: '三级',
                component: '/multilevel/level-2-2/level-2-2-2'
            }
            ]
        },
        {
            path: 'level_2_3',
            name: 'level_2_3',
            icon: 'md-funnel',
            title: '二级-3',
            component: '/multilevel/level-2-3'
        }
        ]
    },
    {
        path: '/argu',
        name: 'argu',
        meta: {
            hideInMenu: true
        },
        children: [{
            path: 'params/:id',
            name: 'params',
            icon: 'md-flower',
            title: route => `{{ params }}-${route.params.id}`,
            meta: {
                notCache: true,
                beforeCloseName: 'before_close_normal'
            },
            component: '/argu-page/params'
        },
        {
            path: 'query',
            name: 'query',
            icon: 'md-flower',
            title: route => `{{ query }}-${route.query.id}`,
            meta: {
                notCache: true
            },
            component: '/argu-page/query'
        }
        ]
    },
    ]
}