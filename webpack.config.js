
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DelWebpackPlugin = require('del-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const PACKAGE = require('./package.json')

// To show version to the script when it's built
const banner = `${PACKAGE.name} v${PACKAGE.version} | htr | Released under the ${PACKAGE.license} license`

const config = {
    entry: {
        "htr-hls-stories" : "./src/Entries/loader.ts",
    },
    optimization: {
        usedExports: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: { output: { ascii_only: true } },
                extractComments: false,
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('sass')  // Make sure Dart Sass is used
                    }
                }],
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: banner,
            entryOnly: true,
        })
    ],
    devServer: {
        static: './dist',
        open: {
            target: ['/lab/index.html'], // this tells dev server what to open
        },
        port: 3000
    },
    mode: 'development',
}

module.exports = (env, options) => {
    const isProd = options.mode === 'production'

    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: isProd ? '[name].min.js' : '[name].js',
        chunkFilename: isProd ? '[id].min.[chunkhash:8].js' : '[id].chunk.js',
    }


    if (env.env === 'dev' || env.env === 'staging') {

        config.plugins.push(
            new webpack.DefinePlugin({
                PRODUCTION: isProd ? JSON.stringify(true) : JSON.stringify(false),
                VERSION: JSON.stringify(require('./package.json').version)
            }),
            /** Example pages */
            new HtmlWebpackPlugin({
                template: 'src/Lab/index.html',
                filename: 'lab/index.html',
                chunks: [] 
            }),
            new HtmlWebpackPlugin({
                template: 'src/Lab/default.html',
                filename: 'lab/default.html',
                chunks: ['htr-hls-stories'],
            }),
            new HtmlWebpackPlugin({
                template: 'src/Lab/outstream.html',
                filename: 'lab/outstream.html',
                chunks: ['htr-hls-stories'],
            }),
            new HtmlWebpackPlugin({
                template: 'src/Lab/outstream_vast.html',
                filename: 'lab/outstream_vast.html',
                chunks: ['htr-hls-stories'],
            }),
            new HtmlWebpackPlugin({
                template: 'src/Lab/outstream_custom_ima.html',
                filename: 'lab/outstream_custom_ima.html',
                chunks: ['htr-hls-stories'],
            }),
            new HtmlWebpackPlugin({
                template: 'src/Lab/lazy_loading.html',
                filename: 'lab/lazy_loading.html',
                chunks: ['htr-hls-stories'],
            }),
        )

    }

    if (env.env === 'prod') {
        config.plugins.push(
            new DelWebpackPlugin({
                include: ['**', './*'],
                exclude: ['*.LICENSE.*'],
                info: true,
                keepGeneratedAssets: true,
                allowExternal: true
            })
        );
    }

    return config
}