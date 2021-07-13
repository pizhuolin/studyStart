// const path = require('path')
// const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    lintOnSave: false, // eslint-loader 是否在保存的时候检查
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // webpack配置
    chainWebpack: (config) => {
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            // 将每个依赖包打包成单独的js文件
            let optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name (module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }/*,
                minimizer: [new UglifyPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true, // console
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    }
                })]*/
            }
            Object.assign(config, {
                optimization
            })
        } else {
            // 为开发环境修改配置...
            config.mode = 'development'
        }
    },
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0', // 允许外部ip访问
        port: 2333, // 端口
        https: false, // 启用https
        overlay: {
            warnings: true,
            errors: true
        }, // 错误、警告在页面弹出
        proxy: {
            '/api': {
                target: 'http://www.baidu.com/api',
                changeOrigin: true, // 允许websockets跨域
                // ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        } // 代理转发配置，用于调试环境
    },
    // 第三方插件配置
    pluginOptions: {}
}