'use strict'

import Mock from 'mockjs';

//构造 mock 请求的返回结果模型
export const builder = (respond, message = '', code = 200) => {
  console.log('builder respond ', respond)
  return function (req) {

    console.log('builder req ', req);

    let result = respond;
    if (respond instanceof Function) {
      result = respond(req)
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