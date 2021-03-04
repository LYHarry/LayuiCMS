import Vue from 'vue'
// base library
import {

    // Form, FormItem, Card, Input, Icon, Button

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


    // Form, FormItem, Card, Input, Icon, Button

    Form, FormItem, Input, Radio, Checkbox, Switch, Select, InputNumber, Button,
    Icon, Row, Col, Layout, Card, Divider, Table, Tabs, Menu,
    Cascader, Upload, Avatar, Tag, Tooltip, Modal
]

// Vue.component('Form', Form)
// Vue.component('FormItem', FormItem)
// Vue.component('Input', Input)
// Vue.component('Button', Button)
// Vue.component('Card', Card)
// Vue.component('Icon', Icon)

//注册组件
components.map(component => {
    if (component.name && component.name.startsWith('i')) {
        component.name = component.name.substr(1);
    }
    Vue.component(component.name, component)
});

Vue.prototype.$apis = apis
Vue.prototype.$Conf = config