'use strict'

import Mock from 'mockjs'

//构造 mock 请求的返回结果模型
export const builder = (respond, message = '', code = 200) => {
  return function (req) {
    // console.log('builder req ', req);
    let result = respond;
    if (respond instanceof Function) {
      result = respond(JSON.parse(req.body))
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