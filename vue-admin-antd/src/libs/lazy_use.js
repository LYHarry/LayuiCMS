import Vue from 'vue'

// base library
import {
    ConfigProvider,
    Layout,
    Input,
    InputNumber,
    Button,
    Switch,
    Radio,
    Checkbox,
    Select,
    Card,
    Form,
    Row,
    Col,
    Modal,
    Table,
    Tabs,
    Icon,
    Badge,
    Popover,
    Dropdown,
    List,
    Avatar,
    Breadcrumb,
    Steps,
    Spin,
    Menu,
    Drawer,
    Tooltip,
    Alert,
    Tag,
    Divider,
    DatePicker,
    TimePicker,
    Upload,
    Progress,
    Skeleton,
    Popconfirm,
    PageHeader,
    Result,
    Statistic,
    Descriptions,
    message,
    notification,
    Cascader,
    AutoComplete,
} from 'ant-design-vue'

// ext library
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import { PageHeaderWrapper } from "@ant-design-vue/pro-layout"
import { Dialog } from '@/components'

//页面操作按钮权限
import ActionPermission from '@/permission/action'
import '@/directives/action'
import apis from '@/apis'
import config from "@/config";

const components = [
    ConfigProvider,
    Layout,
    Input,
    InputNumber,
    Button,
    Switch,
    Radio,
    Checkbox,
    Select,
    Card,
    Form,
    Row,
    Col,
    Modal,
    Table,
    Tabs,
    Icon,
    Badge,
    Popover,
    Dropdown,
    List,
    Avatar,
    Breadcrumb,
    Steps,
    Spin,
    Menu,
    Drawer,
    Tooltip,
    Alert,
    Tag,
    Divider,
    DatePicker,
    TimePicker,
    Upload,
    Progress,
    Skeleton,
    Popconfirm,
    PageHeader,
    Result,
    Statistic,
    Descriptions,
    Viser,
    Dialog,
    ActionPermission,
    VueCropper,
    Cascader,
    AutoComplete,
];

Vue.component('page-header-wrapper', PageHeaderWrapper)

//设置组件默认属性
Card.props.bordered.default = false
Modal.props.destroyOnClose.default = true
// Modal.props.keyboard.default = false
// Modal.props.maskClosable.default = false
Table.props.bordered.default = true
Table.props.rowKey.default = "id"
Cascader.props.fieldNames.default = {
    label: 'CName',
    value: 'ID',
    children: 'children'
}


//注册组件
components.map(component => {
    Vue.use(component)
});

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$confirm = Modal.confirm
// Vue.prototype.$info = Modal.info
// Vue.prototype.$success = Modal.success
// Vue.prototype.$error = Modal.error
// Vue.prototype.$warning = Modal.warning
// Vue.prototype.$destroyAll = Modal.destroyAll
Vue.prototype.$apis = apis
Vue.prototype.$Conf = config
