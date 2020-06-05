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
} from 'ant-design-vue'


// ext library
import Viser from 'viser-vue'


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
    Viser
];


//注册组件
const install = function (Vue) {
    components.map(component => {
        Vue.use(component)
    });

    Vue.prototype.$message = message;
    Vue.prototype.$notification = notification;
    // Vue.prototype.$info = Modal.info;
    // Vue.prototype.$success = Modal.success;
    // Vue.prototype.$error = Modal.error;
    // Vue.prototype.$warning = Modal.warning;
    // Vue.prototype.$confirm = Modal.confirm;
    // Vue.prototype.$destroyAll = Modal.destroyAll;
};

install(Vue);