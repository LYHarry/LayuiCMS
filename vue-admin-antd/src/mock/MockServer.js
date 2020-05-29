'use strict'

import Mock from 'mockjs';
import { builder } from './util';
import MenuRouter from './modules/MenuRouter';
import Auth from './modules/auth';

// TODO 判断是否 IE 浏览器，IE 不支持 mock

const MockData = [
    MenuRouter,
    ...Auth
];

for (const i of MockData) {
    i.type = i.type || 'POST';
    console.log('i.url ', i.url, ' i.type ', i.type)
    Mock.mock(new RegExp(`'${i.url}'`), i.type, builder(i.response))
}

// Mock.mock(new RegExp('http://localhost:8080/auth/2stepcode'), 'POST', (req) => {

//     console.log('Mock req ', req)

//     return { setpcode: 1 };

// })

const twofactor = (req) => {
    console.log('Mock req ', req)
    return { stepCode: Mock.mock('@integer(0, 1)') }
}

// /\/auth\/2stepcode/
// Mock.mock(new RegExp('/auth/2stepcode'), 'post', builder({ setpcode: 1 }))

Mock.setup({
    timeout: 800 // setter delay time
})