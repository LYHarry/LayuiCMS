import Vue from 'vue'
// base library
import {
    // 表单
    Form, FormItem, Input, Radio, Checkbox, Switch, Select, InputNumber, Button, AutoComplete,
    // 布局
    Layout, Row, Col, Card, Sider, Header, Content,
    // 菜单
    Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem,

    Icon, Divider, Table, Tabs, Badge, Breadcrumb, BreadcrumbItem,
    Cascader, Upload, Avatar, Tag, Tooltip, Modal
} from 'view-design'
//apis
import apis from '@/apis'
//全局配置
import config from "@/config"

// DatePicker  TimePicker

const components = [
    Form, FormItem, Input, Radio, Checkbox, Switch, Select, InputNumber, Button, AutoComplete,
    Layout, Row, Col, Card, Sider, Header, Content,
    Menu, Submenu, MenuItem, Dropdown, DropdownMenu, DropdownItem,

    Icon, Divider, Table, Tabs, Badge, Breadcrumb, BreadcrumbItem,
    Cascader, Upload, Avatar, Tag, Tooltip, Modal
]

//注册组件
components.map(component => {
    if (component.name === 'iForm') component.name = 'Form';
    Vue.component(component.name, component)
});

//挂载全局变量
Vue.prototype.$apis = apis
Vue.prototype.$Conf = config