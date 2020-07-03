'use strict'

// 开发环境参数配置
module.exports = {
    NODE_ENV: 'development',

    BASE_URL: 'http://localhost:9000', //接口域名

    maxContentLength: 5000, //允许的响应内容的最大长度

    Timeout_Time: 5000, //接口超时时间 (0 表示无超时时间)
    Timeout_Retry: 0, //超时重试次数
    Timeout_RetryDelay: 2000, //超时重试间隔时间

    //代理配置表
    proxyTable: {
        //   '/api': {
        //     target: 'http://localhost:51296',  // 接口域名
        //     changeOrigin: true,  //是否跨域
        //     secure: false,  // 是否https协议
        //     pathRewrite: function (path, req) {
        //       path = path.replace(/(\/api)/g, '');
        //       return ('/api' + path);
        //     }
        //   }
    },
    host: 'localhost',
    port: 9000,
    autoOpenBrowser: false,
    overlay: true,
}