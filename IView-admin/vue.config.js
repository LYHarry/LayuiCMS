const webpack = require('webpack')
const envConfig = require('./env')

module.exports = {
    // webpack配置
    configureWebpack: {
        // webpack plugins
        plugins: [
            //定义全局常量
            new webpack.DefinePlugin({
                'envConfig': JSON.stringify(envConfig)
            })
        ],
    },
    //默认false 可以加快打包
    productionSourceMap: false,
    chainWebpack: (config) => {
        //别名
        // config.resolve.alias
        //     .set('@$', resolve('src'))
    },

    // // css相关配置
    // css: {
    //     loaderOptions: { // 向 CSS 相关的 loader 传递选项
    //         less: {
    //             javascriptEnabled: true
    //         }
    //     }
    // },

    // webpack-dev-server 相关配置
    devServer: {
        port: 8800,
        // 让浏览器 overlay 同时显示警告和错误
        overlay: {
            warnings: true,
            errors: true
        },
        // //代理配置表
        // proxy: {
        //     '/api': {
        //         target: envConfig.BASE_URL,
        //         changeOrigin: true, // 是否允许跨越
        //         secure: false,  // 是否 https
        //         ws: false,  // 代理 websockets
        //         pathRewrite: {
        //             '^/api': '/apis',//重写,
        //         }
        //     }
        // }
    }
}