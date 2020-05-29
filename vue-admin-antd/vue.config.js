'use strict'

module.exports = {

    // css相关配置
    css: {
        loaderOptions: { // 向 CSS 相关的 loader 传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },

    // webpack-dev-server 相关配置
    devServer: {
        // before 钩子函数，可用于配置 mock 数据
        // 在所有其他中间件之前执行
        // before: require('./src/mock/MockServer'),

    }
}