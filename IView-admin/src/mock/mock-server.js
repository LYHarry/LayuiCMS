import { isIE } from '@/libs/utils'
import Mock from 'mockjs'
import base from './modules/base'
import MenuRouter from './modules/MenuRouter'

if (isIE()) {
    console.error('[antd-pro] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
}

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
        const responseBody = {
            message: message,
            data: result,
            serveStatus: code,
            status: 1
        };
        if (result.code && result.message && result.data) {
            responseBody.message = result.message
            responseBody.data = result.data
            responseBody.serveStatus = result.code
        }
        return Mock.mock(responseBody);
    }
}

const MockData = [
    ...base,
    MenuRouter

];

console.log('MockData ', MockData)

for (const i of MockData) {
    i.type = (i.type || 'post').toLowerCase();
    Mock.mock(new RegExp(i.url), i.type, builder(i.response))
}