'use strict'

import Mock from 'mockjs'
import MenuRouter from './modules/MenuRouter'
import baseApi from './modules/baseApi'
import Manage from './modules/manage'
import Dashboard from './modules/dashboard'

// TODO 判断是否 IE 浏览器，IE 不支持 mock

// mock patch
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false
        if (this.responseType) {
            this.custom.xhr.responseType = this.responseType
        }
    }
    this.proxy_send(...arguments)
}

Mock.setup({
    timeout: 800 // setter delay time
})

//构造 mock 请求的返回结果模型
const builder = (respond, message = '', code = 200) => {
    return function (req) {
        let result = respond;
        if (respond instanceof Function) {
            result = respond(JSON.parse(req.body))
        }
        if (result instanceof Function) {
            return Mock.mock(result)
        }
        if (result.code && result.message && result.data) {
            return Mock.mock(result)
        }
        const responseBody = {
            message: message,
            data: result,
            code: code
        };
        return Mock.mock(responseBody);
    }
}

const MockData = [
    MenuRouter,
    ...baseApi,
    ...Manage,
    ...Dashboard
];

console.log('MockData ', MockData)

for (const i of MockData) {
    i.type = (i.type || 'post').toLowerCase();
    Mock.mock(new RegExp(i.url), i.type, builder(i.response))
}


