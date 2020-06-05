'use strict'

module.exports = {

    chainWebpack: (config) => {
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
        // before 钩子函数，可用于配置 mock 数据
        // 在所有其他中间件之前执行
        // before: require('./src/mock/MockServer'),

    }
}