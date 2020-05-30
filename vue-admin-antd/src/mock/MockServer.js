'use strict'

import Mock from 'mockjs'
import { builder } from './util'

import MenuRouter from './modules/MenuRouter'
import Auth from './modules/auth'

// TODO 判断是否 IE 浏览器，IE 不支持 mock

Mock.setup({
    timeout: 800 // setter delay time
})

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

const MockData = [
    MenuRouter,
    ...Auth
];

for (const i of MockData) {
    i.type = (i.type || 'post').toLowerCase();
    Mock.mock(new RegExp(i.url), i.type, builder(i.response))
}