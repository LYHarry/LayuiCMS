import Vue from 'vue'
// base library
import {
    //日期时间
    DatePicker, TimePicker,
    // 表单
    Form, FormItem, Input, Radio, Checkbox, Switch, Select, Option, InputNumber, Button, AutoComplete,
    // 布局
    Layout, Row, Col, Card, Sider, Header, Content,
    // 菜单
    Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem,
    //提示
    Modal, Message, Tooltip, Poptip, Badge, Notice,

    Icon, Divider, Table, Tabs, Breadcrumb, BreadcrumbItem, Spin, Tree, Drawer,
    Cascader, Upload, Avatar, Tag,
} from 'view-design'
//apis
import apis from '@/apis'
//全局配置
import config from "@/config"

//三方组件
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import TreeTable from 'tree-table-vue'
import '@/assets/icons/iconfont.css'

//指令
import importDirective from '@/directive'




const components = [
    FormItem, Input, Radio, Checkbox, Switch, Select, Option, InputNumber, Button, AutoComplete,
    Layout, Row, Col, Card, Sider, Header, Content,
    Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem,
    Modal, Tooltip, Poptip, Badge,

    Icon, Divider, Table, Tabs, Breadcrumb, BreadcrumbItem, Spin, Tree, Drawer,
    Cascader, Upload, Avatar, Tag,
]


Vue.use(VOrgTree)
Vue.use(TreeTable)
//注册指令
importDirective(Vue)

//注册组件
Vue.component('DatePicker', DatePicker)
Vue.component('TimePicker', TimePicker)
Vue.component('Form', Form)
components.map(component => {
    Vue.component(component.name, component)
});


//挂载全局变量
Vue.prototype.$apis = apis
Vue.prototype.$Conf = config
Vue.prototype.$Message = Message
Vue.prototype.$Notice = Notice