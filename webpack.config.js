const path = require('path');

const { CLIENT_FILE_NAME } = require('./src/constants');

const dev = {
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    entry: {
        [CLIENT_FILE_NAME]: path.resolve(__dirname, 'src/client/ads.client.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist'),
        hashFunction: 'sha256'
    }
};

const prod = {
    mode: 'production',
    devtool: false,
    watch: false,
    entry: {
        [`${CLIENT_FILE_NAME}.min`]: path.resolve(__dirname, 'src/client/ads.client.js')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/dist'),
        hashFunction: 'sha256'
    }
};

module.exports = env => {
    return (env.development) ? dev : prod;
};