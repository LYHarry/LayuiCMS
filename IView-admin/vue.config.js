const webpack = require('webpack')
const envConfig = require('./env')

module.exports = {
    // webpack配置
    configureWebpack: {
        // webpack plugins
        plugins: [
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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

        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule.oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-icon-loader')
            .loader('vue-svg-icon-loader')
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'assets/[name].[hash:8].[ext]'
            });

        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill'
        }]);
    },

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