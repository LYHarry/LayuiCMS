const path = require('path')
const webpack = require('webpack')

module.exports = {
    // webpack配置
    configureWebpack: {
        // webpack plugins
        plugins: [
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.DefinePlugin({

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
            })

        // if prod is on
        // assets require on cdn
        // if (isProd) {
        //     config.plugin('html').tap(args => {
        //         args[0].cdn = assetsCDN
        //         return args
        //     })
        // }
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
        //代理配置表
        proxyTable: {
            '/api': {
                target: 'http://193.112.58.251:8080/adminPet',
                changeOrigin: true, // 是否允许跨越
                secure: false,  // 是否https协议
                pathRewrite: {
                    '^/api': '/api',//重写,
                }
            }
        }
    }
}