import Vue from 'vue'
// base library
import {
    Form, FormItem, Input, Radio, Checkbox, Switch, Select, InputNumber, Button,

    Icon, Row, Col, Layout, Card, Divider, Table, Tabs, Menu,
    Cascader, Upload, Avatar, Tag, Tooltip, Modal
} from 'view-design'
//apis
import apis from '@/apis'
//全局配置
import config from "@/config"

// DatePicker  TimePicker

const components = [
    Form, FormItem, Input, Radio, Checkbox, Switch, Select, InputNumber, Button,

    Icon, Row, Col, Layout, Card, Divider, Table, Tabs, Menu,
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